import { Router } from 'express'
import { getAccess2Route } from '../middleware/auth'
import { AuthController } from '../controllers'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/me', getAccess2Route, AuthController.getMe)

export default router
