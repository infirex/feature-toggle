// services/FeatureService.ts
import { AppDataSource } from '../helpers/dbHelpers'
import { Feature } from '../models/Feature'
import { FeatureFlag } from '../models/FeatureFlag'
import { Tenant } from '../models/Tenant'
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
}

export const featureService = new FeatureService()
