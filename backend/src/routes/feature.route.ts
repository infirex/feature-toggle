import { Router } from 'express'
import { FeatureController } from '../controllers/feature.controller'
import { getAccess2Route } from '../middleware/auth'

const router = Router()

router.use('/', getAccess2Route)

router.get('/', FeatureController.getFeatures)
router.post('/', FeatureController.createOrUpdateFeature)
router.delete('/', FeatureController.deleteFeature)

export default router
