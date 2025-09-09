import { AppDataSource } from '../helpers/dataSource'
import { Feature, FeatureFlag, Tenant } from '../models'
import { AppError } from '../utils/AppError'
import { auditService } from './audit.service'

class FeatureService {
  constructor(
    private readonly featureFlagRepo = AppDataSource.getRepository(FeatureFlag),
    private readonly featureRepo = AppDataSource.getRepository(Feature),
    private readonly tenantRepo = AppDataSource.getRepository(Tenant)
  ) {}

  async listFlags(tenantName: string, env: string, page = 1, limit = 20) {
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    const [flags, total] = await this.featureFlagRepo.findAndCount({
      where: { tenant: { id: tenant.id }, env },
      relations: ['feature'],
      skip: (page - 1) * limit,
      take: limit
    })

    return { flags, total, page, limit }
  }

  async createOrUpdateFlag(
    tenantName: string,
    env: string,
    featureKey: string,
    enabled: boolean,
    actor: string = 'system'
  ) {
    // 1. Find tenant
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    // 2. Find or create feature
    let feature = await this.featureRepo.findOne({ where: { key: featureKey } })
    if (!feature) {
      feature = this.featureRepo.create({ key: featureKey, description: '' })
      await this.featureRepo.save(feature)
    }

    // 3. Find existing feature flag
    let flag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, feature: { id: feature.id }, env },
      relations: ['tenant', 'feature'] // populate for audit log
    })

    let beforeState: any = null
    let action: 'create' | 'update'

    if (!flag) {
      // Create new flag
      flag = this.featureFlagRepo.create({ tenant, feature, env, enabled })
      action = 'create'
    } else {
      // Update existing flag
      beforeState = {
        id: flag.id,
        tenant: flag.tenant.name,
        feature: flag.feature.key,
        env: flag.env,
        enabled: flag.enabled
      }
      flag.enabled = enabled // update the enabled state
      action = 'update'
    }

    const savedFlag = await this.featureFlagRepo.save(flag)

    // 4. Prepare after state
    const afterState = {
      id: savedFlag.id,
      tenant: savedFlag.tenant.name,
      feature: savedFlag.feature.key,
      env: savedFlag.env,
      enabled: savedFlag.enabled
    }

    // 5. Audit log
    await auditService.logChange(
      actor,
      action,
      'FeatureFlag',
      savedFlag.id,
      beforeState,
      afterState
    )

    return savedFlag
  }

  async deleteFlag(tenantName: string, env: string, featureKey: string, actor: string = 'system') {
    // 1. Find the tenant by name
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    // 2. Find the feature by key
    const feature = await this.featureRepo.findOne({ where: { key: featureKey } })
    if (!feature) throw new AppError('Feature not found', 404)

    // 3. Find the feature flag for this tenant, feature, and environment
    const flag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, feature: { id: feature.id }, env }
    })
    if (!flag) throw new AppError('Feature flag not found', 404)

    // 4. Save the current state as "before" for audit logging
    const beforeState = {
      id: flag.id,
      tenant: { id: tenant.id, name: tenant.name },
      feature: { id: feature.id, key: feature.key },
      env: flag.env,
      enabled: flag.enabled
    }

    // 5. Remove the feature flag
    await this.featureFlagRepo.remove(flag)

    // 6. Log the deletion in the audit log
    await auditService.logChange(
      actor,
      'delete',
      'FeatureFlag',
      beforeState.id,
      beforeState,
      null // No "after" state for deletion
    )

    return { message: 'Feature flag deleted' }
  }

  async promoteFlags(
    tenantName: string,
    featureKeys: string[],
    fromEnv: string,
    toEnv: string,
    dryRun = true,
    actor: string = 'system'
  ) {
    // 1. Find tenant
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    const results: {
      key: string
      action: string
      before?: boolean
      after?: boolean
      dryRun: boolean
    }[] = []

    // 2. Promote each feature key
    for (const featureKey of featureKeys) {
      const result = await this.promoteSingleFlag(tenant, featureKey, fromEnv, toEnv, dryRun, actor)
      results.push(result)
    }

    return { tenant: tenantName, fromEnv, toEnv, dryRun, results }
  }

  // Helper to promote a single flag
  private async promoteSingleFlag(
    tenant: Tenant,
    featureKey: string,
    fromEnv: string,
    toEnv: string,
    dryRun: boolean,
    actor: string
  ) {
    // 1. Find source and target flags
    const [sourceFlag, targetFlag] = await Promise.all([
      this.featureFlagRepo.findOne({
        where: { tenant: { id: tenant.id }, env: fromEnv, feature: { key: featureKey } },
        relations: ['feature', 'tenant']
      }),
      this.featureFlagRepo.findOne({
        where: { tenant: { id: tenant.id }, env: toEnv, feature: { key: featureKey } },
        relations: ['feature', 'tenant']
      })
    ])

    if (!sourceFlag) {
      throw new AppError(
        `Feature flag '${featureKey}' not found in '${fromEnv}' for tenant '${tenant.name}'`,
        404
      )
    }

    // 2. Decide action type and before/after state
    const isOverwrite = !!targetFlag
    let actionType: string

    if (dryRun) {
      actionType = isOverwrite ? 'would overwrite' : 'would create'
    } else {
      actionType = isOverwrite ? 'overwrite' : 'create'
    }
    const action = actionType
    const beforeState = isOverwrite
      ? {
          id: targetFlag.id,
          tenant: tenant.name,
          feature: targetFlag.feature.key,
          env: fromEnv,
          enabled: targetFlag.enabled
        }
      : null

    // afterState mirrors beforeState structure with updated values
    const afterState = {
      id: targetFlag?.id ?? sourceFlag.id,
      tenant: tenant.name,
      feature: sourceFlag.feature.key,
      env: toEnv,
      enabled: sourceFlag.enabled
    }

    // 3. Apply changes if not dryRun
    if (!dryRun) {
      // If target flag exists, overwrite it; otherwise, create new
      if (isOverwrite) {
        targetFlag.enabled = sourceFlag.enabled
        await this.featureFlagRepo.save(targetFlag)
        await auditService.logChange(
          actor,
          'promote',
          'FeatureFlag',
          targetFlag.id,
          beforeState,
          afterState
        )
      } else {
        const newFlag = this.featureFlagRepo.create({
          tenant,
          feature: sourceFlag.feature,
          env: toEnv,
          enabled: sourceFlag.enabled
        })
        await this.featureFlagRepo.save(newFlag)
        await auditService.logChange(actor, 'promote', 'FeatureFlag', newFlag.id, null, afterState)
      }
    }

    // 4. Return result object
    return {
      key: featureKey,
      action,
      before: beforeState?.enabled,
      after: afterState.enabled,
      dryRun
    }
  }
}

export const featureService = new FeatureService()
