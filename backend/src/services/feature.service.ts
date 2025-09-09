import { AppDataSource } from '../helpers/dbHelpers'
import { Feature, FeatureFlag, Tenant } from '../models'
import { AppError } from '../utils/AppError'

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

  async createOrUpdateFlag(tenantName: string, env: string, featureKey: string, enabled: boolean) {
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    let feature = await this.featureRepo.findOne({ where: { key: featureKey } })
    if (!feature) {
      feature = this.featureRepo.create({ key: featureKey, description: '' })
      await this.featureRepo.save(feature)
    }

    let flag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, feature: { id: feature.id }, env }
    })

    if (!flag) {
      flag = this.featureFlagRepo.create({ tenant, feature, env, enabled })
    } else {
      flag.enabled = enabled
    }

    return await this.featureFlagRepo.save(flag)
  }

  async deleteFlag(tenantName: string, env: string, featureKey: string) {
    const tenant = await this.tenantRepo.findOne({ where: { name: tenantName } })
    if (!tenant) throw new AppError('Tenant not found', 404)

    const feature = await this.featureRepo.findOne({ where: { key: featureKey } })
    if (!feature) throw new AppError('Feature not found', 404)

    const flag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, feature: { id: feature.id }, env }
    })
    if (!flag) throw new AppError('Feature flag not found', 404)

    await this.featureFlagRepo.remove(flag)
    return { message: 'Feature flag deleted' }
  }

  async promoteFlags(
    tenantName: string,
    featureKeys: string[],
    fromEnv: string,
    toEnv: string,
    dryRun = true
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

    // 2. Process each feature key
    for (const featureKey of featureKeys) {
      const res = await this.promoteSingleFlag(tenant, featureKey, fromEnv, toEnv, dryRun)
      results.push(res)
    }

    return { tenant: tenantName, fromEnv, toEnv, dryRun, results }
  }

  // Helper to promote a single flag
  private async promoteSingleFlag(
    tenant: Tenant,
    featureKey: string,
    fromEnv: string,
    toEnv: string,
    dryRun: boolean
  ) {
    // find source flag
    const sourceFlag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, env: fromEnv, feature: { key: featureKey } },
      relations: ['feature', 'tenant']
    })

    if (!sourceFlag) {
      throw new AppError(
        `Feature flag '${featureKey}' not found in '${fromEnv}' for tenant '${tenant.name}'`,
        404
      )
    }

    // find target flag
    const targetFlag = await this.featureFlagRepo.findOne({
      where: { tenant: { id: tenant.id }, env: toEnv, feature: { key: featureKey } },
      relations: ['feature', 'tenant']
    })

    // overwrite case
    if (targetFlag) {
      const result = {
        key: featureKey,
        action: dryRun ? 'would overwrite' : 'overwrite',
        before: targetFlag.enabled,
        after: sourceFlag.enabled,
        dryRun
      }

      if (!dryRun) {
        targetFlag.enabled = sourceFlag.enabled
        await this.featureFlagRepo.save(targetFlag)
      }
      return result
    }

    // create case
    const result = {
      key: featureKey,
      action: dryRun ? 'would create' : 'create',
      after: sourceFlag.enabled,
      dryRun
    }

    if (!dryRun) {
      const newFlag = this.featureFlagRepo.create({
        tenant,
        feature: sourceFlag.feature,
        env: toEnv,
        enabled: sourceFlag.enabled
      })
      await this.featureFlagRepo.save(newFlag)
    }

    return result
  }
}

export const featureService = new FeatureService()
