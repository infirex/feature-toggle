import express from 'express'
import auth from './auth.route'
import feature from './feature.route'
import audit from './audit.route'
import { rateLimiter } from '../middleware'

const router = express.Router()

router.use('/auth', auth)

// router.use('/', rateLimiter)

// features
router.use('/features', rateLimiter, feature)

// audit logs
router.use('/audit-logs', rateLimiter, audit)

export default router
