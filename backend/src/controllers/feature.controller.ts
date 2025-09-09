import { Request, Response } from 'express'
import { featureService } from '../services'
import { asyncWrapper } from '../utils/AsyncWrapper'

export class FeatureController {
  static readonly getFeatures = asyncWrapper(async (req: Request, res: Response) => {
    const { env, page, limit } = req.query
    const data = await featureService.listFlags(
      req.user?.tenant as string,
      env as string,
      Number(page) || 1,
      Number(limit) || 20
    )
    res.json(data)
  })

  static readonly createOrUpdateFeature = asyncWrapper(async (req: Request, res: Response) => {
    const { env, featureKey, enabled } = req.body
    const flag = await featureService.createOrUpdateFlag(
      req.user?.tenant as string,
      env,
      featureKey,
      enabled,
      req.user?.email
    )
    res.json(flag)
  })

  static readonly deleteFeature = asyncWrapper(async (req: Request, res: Response) => {
    const { env, featureKey } = req.body
    const result = await featureService.deleteFlag(
      req.user?.tenant as string,
      env,
      featureKey,
      req.user?.email
    )
    res.json(result)
  })

  static readonly promoteFeatures = asyncWrapper(async (req: Request, res: Response) => {
    const { fromEnv, toEnv, featureKeys, dryRun = true } = req.body
    const result = await featureService.promoteFlags(
      req.user?.tenant as string,
      featureKeys,
      fromEnv,
      toEnv,
      dryRun,
      req.user?.email
    )
    res.json(result)
  })
}
