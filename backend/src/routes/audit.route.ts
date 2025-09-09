// @route /api/audit-logs
import { Router } from 'express'
import { getAccess2Route } from '../middleware'
import { AuditController } from '../controllers'

const router = Router()

router.use('/', getAccess2Route)

router.get('/', AuditController.getLogs)

export default router
