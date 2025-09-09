import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/AsyncWrapper'
import { auditService } from '../services'

export class AuditController {
  static readonly getLogs = asyncWrapper(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const tenant = req.query.tenant as string | undefined
    const entity = req.query.entity as string | undefined
    const action = req.query.action as 'create' | 'update' | 'delete' | 'promote' | undefined

    const data = await auditService.getLogs(page, limit, { tenant, entity, action })

    res.json(data)
  })
}
