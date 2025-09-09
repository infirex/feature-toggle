import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../helpers/dbHelpers'
import { Tenant } from '../models/Tenant'
import { AppError } from '../utils/AppError'

export const attachTenant = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || typeof apiKey !== 'string') {
    return next(new AppError('Missing API Key', 401))
  }

  const tenantRepo = AppDataSource.getRepository(Tenant)
  const tenant = await tenantRepo.findOne({ where: { apiKey } })

  if (!tenant) {
    return next(new AppError('Invalid API Key', 403))
  }

  // attach tenant info to user
  if (req.user) {
    req.user.tenant = tenant.name
  }

  next()
}
