import express from 'express'
import auth from './auth.route'
import feature from './feature.route'
import audit from './audit.route'

const router = express.Router()

router.use('/auth', auth)

// features
router.use('/features', feature)

// audit logs
router.use('/audit-logs', audit)

export default router
