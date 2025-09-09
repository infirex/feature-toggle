// @route /api/features
import { Router } from 'express'
import { FeatureController } from '../controllers'
import { attachTenant, getAccess2Route } from '../middleware'

const router = Router()

router.use('/', getAccess2Route, attachTenant)

router.post('/promote', FeatureController.promoteFeatures)

router.get('/', FeatureController.getFeatures)
router.post('/', FeatureController.createOrUpdateFeature)
router.delete('/', FeatureController.deleteFeature)

export default router
