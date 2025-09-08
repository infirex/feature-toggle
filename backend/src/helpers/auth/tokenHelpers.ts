import { Request, Response } from 'express'
import { User } from '../../models/User'

const isTokenIncluded = (req: Request) => {
  return req.headers.authorization?.startsWith('Bearer:')
}

const getAccessTokenFromHeader = (req: Request) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return undefined
  }
  return authorization.split(' ')[1]
}

const sendJwtToClient = (user: User, res: Response) => {
  const responseUser = user.toResponseObject()

  res
    .cookie('access_token', responseUser.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      secure: process.env.NODE_ENV === 'production'
    })
    .json(responseUser)
}

export { getAccessTokenFromHeader, isTokenIncluded, sendJwtToClient }
