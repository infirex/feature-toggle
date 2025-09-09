import { Request, Response } from 'express'
import { sendJwtToClient } from '../helpers/auth/tokenHelpers'
import { userService } from '../services/userService'
import { asyncWrapper } from '../utils/AsyncWrapper'

export class AuthController {
  // @route POST /api/auth/register
  static readonly register = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password, name } = req.body
    const user = await userService.createUser(email, password, name)
    sendJwtToClient(user, res)
  })

  // @route POST /api/auth/login
  static readonly login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await userService.validateLogin(email, password)
    sendJwtToClient(user, res)
  })

  // @route GET /api/auth/me
  static readonly getMe = asyncWrapper(async (req: Request, res: Response) => {
    res.status(200).json({ user: req.user })
  })
}
