import { Router } from 'express'
import {
  getMeController,
  loginController,
  registerController
} from '../controllers/auth.controller'
import { getAccess2Route } from '../middleware/auth'

const router = Router()

router.post('/register', registerController)
router.post('/login', loginController)

router.get('/me', getAccess2Route, getMeController)

export default router
