require('dotenv').config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import indexRouter from './routes/index'
import { AppError } from './utils/AppError'

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', indexRouter)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Not Found', 404))
})

// error handler
app.use(errorHandler)

export default app
