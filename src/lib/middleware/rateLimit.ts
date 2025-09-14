import rateLimit from 'express-rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import config from '../config'

// In-memory stores for rate limiting (in production, use Redis)
const rateLimits = new Map<string, { hits: number; resetTime: number }>()

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  Array.from(rateLimits.entries()).forEach(([key, value]) => {
    if (value.resetTime < now) {
      rateLimits.delete(key)
    }
  })
}, 60000) // Clean up every minute

// Rate limiting middleware for Next.js
export function createRateLimiter(options: {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests from this IP, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  return function rateLimitMiddleware(request: NextRequest) {
    if (!config.security.enableRateLimiting) {
      // Skip rate limiting if disabled
      return NextResponse.next()
    }

    // Get client identifier (IP address for now)
    const clientIP = getClientIP(request)
    const key = `rateLimit:${clientIP}`

    const now = Date.now()
    const windowStart = now - windowMs

    // Get or create rate limit record
    let record = rateLimits.get(key)
    if (!record || record.resetTime < windowStart) {
      record = {
        hits: 1,
        resetTime: now + windowMs
      }
      rateLimits.set(key, record)
    } else {
      record.hits++
    }

    // Check if rate limit exceeded
    if (record.hits > maxRequests) {
      const resetInMs = record.resetTime - now
      const resetInSeconds = Math.ceil(resetInMs / 1000)

      return NextResponse.json(
        {
          success: false,
          message: message,
          data: null,
          errors: null,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: 'rate-limited',
            version: '1.0.0'
          }
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetInSeconds.toString(),
            'Retry-After': resetInSeconds.toString()
          }
        }
      )
    }

    // Rate limit not exceeded, continue with request
    const remaining = Math.max(0, maxRequests - record.hits)

    const response = NextResponse.next()

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil((record.resetTime - now) / 1000).toString())

    return response
  }
}

// Global rate limiter with default settings
export const globalRateLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  maxRequests: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})

// Specific rate limiters for different endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 login attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.',
  skipSuccessfulRequests: true, // Reset counter on successful login
  skipFailedRequests: false
})

export const apiRateLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  maxRequests: config.rateLimit.maxRequests,
  message: 'API rate limit exceeded. Please slow down your requests.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})

// User action rate limiter (for mutations)
export const mutationRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 50, // 50 mutations per 5 minutes
  message: 'Too many changes in a short time. Please slow down.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})

// Function to get client IP address
function getClientIP(request: NextRequest): string {
  // Try different headers for IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP if multiple are present
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fall back to a generic identifier if IP is not available
  return 'unknown'
}

// Middleware wrapper for different route types
export const withRateLimit = {
  // General API rate limiting
  api: (handler: Function) => {
    return (request: NextRequest, context: any) => {
      const rateLimitCheck = globalRateLimiter(request)
      if (rateLimitCheck.status === 429) {
        return rateLimitCheck
      }
      return handler(request, context)
    }
  },

  // Authentication rate limiting
  auth: (handler: Function) => {
    return (request: NextRequest, context: any) => {
      const rateLimitCheck = authRateLimiter(request)
      if (rateLimitCheck.status === 429) {
        return rateLimitCheck
      }
      return handler(request, context)
    }
  },

  // Mutation rate limiting
  mutation: (handler: Function) => {
    return (request: NextRequest, context: any) => {
      const rateLimitCheck = mutationRateLimiter(request)
      if (rateLimitCheck.status === 429) {
        return rateLimitCheck
      }
      return handler(request, context)
    }
  }
}

// Optional: Redis-based rate limiting (for future production use)
// Uncomment and configure Redis when ready:
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
//
// const redis = new Redis({
//   url: process.env.REDIS_URL!,
//   token: process.env.REDIS_TOKEN!,
// });
//
// export const redisRateLimiter = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(100, "1 m"),
//   analytics: true,
// });

// Export utility functions for rate limit status
export function getRateLimitStatus(request: NextRequest): {
  limit: number
  remaining: number
  resetTime: number
} {
  const clientIP = getClientIP(request)
  const key = `rateLimit:${clientIP}`
  const record = rateLimits.get(key)

  const limit = config.rateLimit.maxRequests
  const now = Date.now()

  if (!record || record.resetTime < now) {
    return {
      limit,
      remaining: limit,
      resetTime: 0
    }
  }

  return {
    limit,
    remaining: Math.max(0, limit - record.hits),
    resetTime: record.resetTime
  }
}
