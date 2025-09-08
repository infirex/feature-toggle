import { Router } from 'express'
import {
  getMeController,
  loginController,
  logoutController,
  registerController
} from '../controllers/authController'
import { getAccess2Route } from '../middleware/auth'

const router = Router()

router.post('/register', registerController)
router.post('/login', loginController)

router.get('/me', getAccess2Route, getMeController)
router.post('/logout', getAccess2Route, logoutController)

export default router
