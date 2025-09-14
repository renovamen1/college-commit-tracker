import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'
import { verifyRefreshToken, createTokenPair } from '@/lib/auth/jwt'
import config from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    // Validate request size
    if (!validateRequestSize(request)) {
      return NextResponse.json({
        success: false,
        message: 'Request too large',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 413 })
    }

    // Extract refresh token from cookie or body
    const refreshToken = extractRefreshToken(request)

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'Refresh token required',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 400 })
    }

    // Verify refresh token
    const refreshPayload = verifyRefreshToken(refreshToken)
    if (!refreshPayload) {
      return NextResponse.json({
        success: false,
        message: 'Invalid refresh token',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // Check if refresh token has expired
    const now = Math.floor(Date.now() / 1000)
    if (refreshPayload.exp && refreshPayload.exp < now) {
      return NextResponse.json({
        success: false,
        message: 'Refresh token expired',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    // Verify user still exists and is active
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({
      _id: new ObjectId(refreshPayload.userId),
      isActive: true
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found or inactive',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    // Create new token pair
    const tokenPair = createTokenPair(
      refreshPayload.userId,
      user.githubUsername,
      user.role
    )

    // Set new access token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: {
          id: refreshPayload.userId,
          githubUsername: user.githubUsername,
          role: user.role
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

    // Set new access token cookie (rotates refresh token on each request)
    response.cookies.set('admin_token', tokenPair.accessToken, {
      httpOnly: true,
      secure: config.app.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })

    // Set new refresh token cookie (rotate for security)
    const rememberMe = request.cookies.get('admin_remember')?.value === 'true'
    const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30d or 7d

    response.cookies.set('admin_refresh_token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: config.app.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxAge,
      path: '/'
    })

    return response

  } catch (error) {
    return errorHandler(error, { endpoint: 'auth/refresh', method: 'POST' })
  }
}

// Extract refresh token from request
function extractRefreshToken(request: NextRequest): string | null {
  // Try refresh token cookie first
  const refreshTokenCookie = request.cookies.get('admin_refresh_token')
  if (refreshTokenCookie) {
    return refreshTokenCookie.value
  }

  // Try from request body
  try {
    const body = request.json().catch(() => ({}))
    return (body as any).refreshToken || null
  } catch {
    return null
  }
}
