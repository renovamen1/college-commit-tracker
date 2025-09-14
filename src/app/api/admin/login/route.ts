import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import User from '@/lib/models/User'
import config from '@/lib/config'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { withValidation } from '@/lib/middleware/validation'
import { authRateLimiter } from '@/lib/middleware/rateLimit'
import { validateRequestSize } from '@/lib/middleware/security'
import { CreateUserSchema } from '@/lib/types/api'

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiterMemory({
  keyPrefix: 'login',
  points: 10, // Number of attempts
  duration: 900, // Per 15 minutes
})

// Enhanced authentication handler
async function handleLogin(request: NextRequest) {
  try {
    // Check request size
    if (!validateRequestSize(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request too large',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        { status: 413 }
      )
    }

    const body = await request.json()
    const { username, password, rememberMe } = body

    // Validate input - demonstrate the new validation system
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 400 })
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

    try {
      await loginRateLimiter.consume(clientIP)
    } catch (rejRes: any) {
      const ttl = Math.ceil(rejRes.msBeforeNext / 1000)

      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. Please try again later.',
          data: null,
          errors: null,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        {
          status: 429,
          headers: {
            'Retry-After': ttl.toString(),
            'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString()
          }
        }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // For now, use simple authentication logic
    // In production, you'd use the User model to find and verify the user

    // Temporary authentication for demo - replace with proper User lookup
    if (username === 'admin@codecommit.edu' && password === 'admin123') {
      const userData = {
        username,
        role: 'admin',
        lastLogin: new Date().toISOString(),
        isActive: true
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: 'admin-user-id', // Replace with actual user ID from database
          username: userData.username,
          role: userData.role
        },
        config.jwt.secret,
        {
          expiresIn: rememberMe
            ? config.jwt.refreshTokenExpires
            : config.jwt.accessTokenExpires
        }
      )

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            username: userData.username,
            role: userData.role
          }
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      })

      // Set secure authentication cookies
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day

      response.cookies.set('admin_token', token, {
        httpOnly: true, // Prevent XSS access
        secure: config.app.nodeEnv === 'production', // HTTPS only in production
        sameSite: 'strict', // Prevent CSRF
        maxAge,
        path: '/'
      })

      response.cookies.set('admin_user', JSON.stringify({
        username: userData.username,
        role: userData.role
      }), {
        httpOnly: false, // Allow client-side access for UI
        secure: config.app.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge,
        path: '/'
      })

      return response
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

  } catch (error) {
    return errorHandler(error, { endpoint: 'login' })
  }
}

export const POST = async (request: NextRequest) => {
  return await handleLogin(request)
}

export async function DELETE(request: NextRequest) {
  // Logout endpoint - clear cookies
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  response.cookies.delete('admin_token')
  response.cookies.delete('admin_user')
  response.cookies.delete('admin_remember')

  return response
}
