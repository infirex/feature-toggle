import { NextFunction, Request, Response } from 'express'
import { sendJwtToClient } from '../helpers/auth/tokenHelpers'
import { userService } from '../services/userService'
import { asyncWrapper } from '../utils/AsyncWrapper'

// @route POST /api/auth/register
const registerController = asyncWrapper(async (req, res) => {
  const { email, password, name } = req.body
  const user = await userService.createUser(email, password, name)
  sendJwtToClient(user, res)
})

// @route POST /api/auth/login
const loginController = asyncWrapper(async (req, res) => {
  const { email, password } = req.body
  const user = await userService.validateLogin(email, password)
  sendJwtToClient(user, res)
})

const getMeController = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(req.user)
})

export { getMeController, loginController, registerController }

