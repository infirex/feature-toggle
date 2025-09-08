import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const getAccess2Route = async (req: Request, res: Response, next: NextFunction) => {
  const { JWT_SECRET } = process.env

  const { access_token } = req.cookies

  if (!access_token) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to access this route'
    })
  }

  jwt.verify(access_token, JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return next(err)
    }
    req.user = decoded as { id: string; email: string }

    next()
  })
}

export { getAccess2Route }
