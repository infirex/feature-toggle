import { NextFunction, Request, Response } from 'express'
import { sendJwtToClient } from '../helpers/auth/tokenHelpers'
import { AppDataSource } from '../helpers/dbHelpers'
import { User } from '../models/User'

// @route POST /api/auth/register
const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body

  try {
    const userRepo = AppDataSource.getRepository(User)
    const existingUser = await userRepo.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const user = userRepo.create({ email, password, name })

    await userRepo.save(user)

    sendJwtToClient(user, res)
  } catch (error) {
    next(error)
  }
}

// @route POST /api/auth/login
const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    const userRepo = AppDataSource.getRepository(User)

    const user = await userRepo.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    sendJwtToClient(user, res)
  } catch (error) {
    next(error)
  }
}

const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    next(error)
  }
}

export { getMeController, loginController, registerController }
