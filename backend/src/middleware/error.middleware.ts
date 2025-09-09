// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err)

  const statusCode = (err instanceof AppError && err.statusCode) || 500
  const message = err instanceof AppError ? err.message : 'Internal Server Error'

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
