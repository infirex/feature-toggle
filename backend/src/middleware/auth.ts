import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getAccessTokenFromHeader } from '../helpers/auth/tokenHelpers'

const getAccess2Route = async (req: Request, res: Response, next: NextFunction) => {
  const access_token = getAccessTokenFromHeader(req)

  if (!access_token) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to access this route'
    })
  }

  const { JWT_SECRET } = process.env

  jwt.verify(access_token, JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return next(err)
    }
    req.user = decoded as { id: string; email: string }

    next()
  })
}

export { getAccess2Route }
