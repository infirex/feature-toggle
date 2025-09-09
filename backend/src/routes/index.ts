import express from 'express'
import auth from './auth.route'
import feature from './feature.route'

const router = express.Router()

router.use('/auth', auth)

// features
router.use('/features', feature)

export default router
