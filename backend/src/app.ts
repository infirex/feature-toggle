import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import client from 'prom-client'
import { errorHandler } from './middleware'
import indexRouter from './routes/index'
import { AppError } from './utils/AppError'

const app = express()

app.use(cors())
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Register default metrics (CPU, memory, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics()

// Example custom metric
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
})

// Middleware to track requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc()
  })
  next()
})

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

app.use('/api', indexRouter)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Not Found', 404))
})

// error handler
app.use(errorHandler)

export default app
