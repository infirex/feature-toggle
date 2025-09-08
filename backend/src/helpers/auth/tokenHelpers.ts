import { Request, Response } from 'express'
import { User } from '../../models/User'

const isTokenIncluded = (req: Request) => {
  return req.headers.authorization?.startsWith('Bearer ')
}

const getAccessTokenFromHeader = (req: Request) => {
  if (!isTokenIncluded(req)) {
    return undefined
  }

  const authorization = req.headers.authorization

  if (!authorization) {
    return undefined
  }

  return authorization.split(' ')[1]
}

const sendJwtToClient = (user: User, res: Response) => {
  const responseUser = user.toResponseObject()

  res.status(200).json(responseUser)
}

export { getAccessTokenFromHeader, sendJwtToClient }
