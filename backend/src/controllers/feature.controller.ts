import { Request, Response } from 'express'
import { featureService } from '../services'
import { asyncWrapper } from '../utils/AsyncWrapper'

export class FeatureController {
  static readonly getFeatures = asyncWrapper(async (req: Request, res: Response) => {
    const { tenant, env, page, limit } = req.query
    const data = await featureService.listFlags(
      tenant as string,
      env as string,
      Number(page) || 1,
      Number(limit) || 20
    )
    res.json(data)
  })

  static readonly createOrUpdateFeature = asyncWrapper(async (req: Request, res: Response) => {
    const { tenant, env, featureKey, enabled } = req.body
    const flag = await featureService.createOrUpdateFlag(tenant, env, featureKey, enabled)
    res.json(flag)
  })

  static readonly deleteFeature = asyncWrapper(async (req: Request, res: Response) => {
    const { tenant, env, featureKey } = req.body
    const result = await featureService.deleteFlag(tenant, env, featureKey)
    res.json(result)
  })

  static readonly promoteFeatures = asyncWrapper(async (req: Request, res: Response) => {
    const { tenant, fromEnv, toEnv, featureKeys, dryRun = true } = req.body
    const result = await featureService.promoteFlags(tenant, featureKeys, fromEnv, toEnv, dryRun)
    res.json(result)
  })
}
