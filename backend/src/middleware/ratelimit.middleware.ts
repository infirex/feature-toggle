import { Request, Response, NextFunction } from 'express'
import { redisClient } from '../helpers/redisClient'
import { AppError } from '../utils/AppError'

// Settings
const BURST_LIMIT = 10 // e.g., 10 requests
const BURST_WINDOW = 10 // in seconds
const SUSTAINED_LIMIT = 100 // e.g., 100 requests
const SUSTAINED_WINDOW = 60 // in seconds

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Identify tenant (via API key header)
    const apiKey = req.headers['x-api-key'] as string
    if (!apiKey) {
      return next(new AppError('Missing API key', 401))
    }

    const now = Math.floor(Date.now() / 1000)

    // Redis keys
    const burstKey = `rate:${apiKey}:burst`
    const sustainedKey = `rate:${apiKey}:sustained`

    // Increment burst counter
    const burstCount = await redisClient.incr(burstKey)
    if (burstCount === 1) {
      await redisClient.expire(burstKey, BURST_WINDOW)
    }

    // Increment sustained counter
    const sustainedCount = await redisClient.incr(sustainedKey)
    if (sustainedCount === 1) {
      await redisClient.expire(sustainedKey, SUSTAINED_WINDOW)
    }

    // Calculate remaining requests
    const burstRemaining = Math.max(BURST_LIMIT - burstCount, 0)
    const sustainedRemaining = Math.max(SUSTAINED_LIMIT - sustainedCount, 0)

    // Add headers
    res.setHeader('X-RateLimit-Burst-Limit', BURST_LIMIT)
    res.setHeader('X-RateLimit-Burst-Remaining', burstRemaining)
    res.setHeader('X-RateLimit-Sustained-Limit', SUSTAINED_LIMIT)
    res.setHeader('X-RateLimit-Sustained-Remaining', sustainedRemaining)

    // Expiry headers (when counters reset)
    const burstTtl = await redisClient.ttl(burstKey)
    const sustainedTtl = await redisClient.ttl(sustainedKey)
    res.setHeader('X-RateLimit-Burst-Reset', now + burstTtl)
    res.setHeader('X-RateLimit-Sustained-Reset', now + sustainedTtl)

    // Check limits
    if (burstCount > BURST_LIMIT) {
      return next(new AppError('Too many requests (burst limit exceeded)', 429))
    }

    if (sustainedCount > SUSTAINED_LIMIT) {
      return next(new AppError('Too many requests (sustained limit exceeded)', 429))
    }

    next()
  } catch (err) {
    next(err)
  }
}
