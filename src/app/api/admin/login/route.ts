import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import User from '@/lib/models/User'
import config from '@/lib/config'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { withValidation } from '@/lib/middleware/validation'
import { authRateLimiter } from '@/lib/middleware/rateLimit'
import { validateRequestSize } from '@/lib/middleware/security'
import { CreateUserSchema } from '@/lib/types/api'
import { createTokenPair } from '@/lib/auth/jwt'

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

    // Ensure database connection is established
    await connectToDatabase()

    // Query user with password field explicitly selected - properly typed
    const user: any = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${username}$`, 'i') } },
        { githubUsername: username }
      ],
      isActive: true
    }).select('+password').lean()

    // Check if user exists
    if (!user) {
      console.log('🚫 LOGIN DEBUG: User not found, returning 401')
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    // Check if password exists
    if (!user.password) {
      console.log('🚫 LOGIN DEBUG: User found but password is missing!')
      return NextResponse.json({
        success: false,
        message: 'Account configuration error. Please contact administrator.',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 500 })
    }

    // Verify password
    console.log('🔐 LOGIN DEBUG: Attempting password verification')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('🔐 LOGIN DEBUG: Password verification result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('🚫 LOGIN DEBUG: Password verification failed')
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    console.log('✅ LOGIN DEBUG: Password verification successful!')

    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Access denied. Admin access required.',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 403 })
    }

    // Generate JWT token pair
    const tokenPair = createTokenPair(
      user._id.toString(),
      user.githubUsername,
      user.role
    )

    // Update last login time (optional)
    await User.findByIdAndUpdate(user._id, {
      lastSyncDate: new Date()
    }).exec()

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          githubUsername: user.githubUsername,
          name: user.name,
          role: user.role
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

    // Set secure authentication cookies
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day

    response.cookies.set('admin_token', tokenPair.accessToken, {
      httpOnly: true, // Prevent XSS access
      secure: config.app.nodeEnv === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevent CSRF
      maxAge,
      path: '/'
    })

    response.cookies.set('admin_user', JSON.stringify({
      id: user._id,
      email: user.email,
      githubUsername: user.githubUsername,
      name: user.name,
      role: user.role
    }), {
      httpOnly: false, // Allow client-side access for UI
      secure: config.app.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/'
    })

    // Set refresh token cookie for token renewal
    response.cookies.set('admin_refresh_token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: config.app.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'login' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
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
