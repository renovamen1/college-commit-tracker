import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from './errorHandler'
import {extractToken, verifyAccessToken, needsRefresh, JWTPayload } from '../auth/jwt'
import config from '../config'

// Authentication options interface
export interface AuthOptions {
  requireAuth?: boolean
  requireRole?: 'admin' | 'student'
  allowRefresh?: boolean
}

// Authentication result interface
export interface AuthResult {
  isAuthenticated: boolean
  isAuthorized: boolean
  user?: JWTPayload
  error?: string
  needsRefresh?: boolean
}

// Validate JWT token from request
export async function validateAuthToken(request: NextRequest): Promise<AuthResult> {
  try {
    // Extract token from request
    const token = extractToken(request)

    if (!token) {
      return {
        isAuthenticated: false,
        isAuthorized: false,
        error: 'No authentication token provided'
      }
    }

    // Verify access token
    const tokenPayload = verifyAccessToken(token)

    if (!tokenPayload) {
      return {
        isAuthenticated: false,
        isAuthorized: false,
        error: 'Invalid or expired access token'
      }
    }

    // Check if token needs refresh
    const refreshNeeded = needsRefresh(token)

    return {
      isAuthenticated: true,
      isAuthorized: true, // Will be refined by role checking
      user: tokenPayload,
      needsRefresh: refreshNeeded
    }

  } catch (error) {
    console.error('Authentication validation error:', error)
    return {
      isAuthenticated: false,
      isAuthorized: false,
      error: 'Authentication validation failed'
    }
  }
}

// Check if user has required role
export function checkRole(user: JWTPayload, requiredRole?: 'admin' | 'student'): AuthResult {
  if (!requiredRole) {
    return {
      isAuthenticated: true,
      isAuthorized: true,
      user
    }
  }

  if (user.role === requiredRole) {
    return {
      isAuthenticated: true,
      isAuthorized: true,
      user
    }
  }

  return {
    isAuthenticated: true,
    isAuthorized: false,
    user,
    error: `Access denied. ${requiredRole} role required, but user has ${user.role} role`
  }
}

// Authentication middleware wrapper for admin routes
export function adminOnly<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  options: Omit<AuthOptions, 'requireRole'> = {}
) {
  return async (...args: T) => {
    const request = args[0] as NextRequest

    try {
      // Step 1: Validate authentication
      const authResult = await validateAuthToken(request)

      if (!authResult.isAuthenticated) {
        return NextResponse.json({
          success: false,
          message: authResult.error || 'Authentication required',
          data: null,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"'
          }
        })
      }

      // Step 2: Check admin role authorization
      const roleResult = checkRole(authResult.user!, 'admin')

      if (!roleResult.isAuthorized) {
        return NextResponse.json({
          success: false,
          message: 'Admin access required',
          data: null,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, {
          status: 403,
          headers: {
            'X-Auth-Error': 'insufficient_permissions'
          }
        })
      }

      // Step 3: Handle automatic token refresh if needed
      if (authResult.needsRefresh && options.allowRefresh !== false) {
        const refreshResult = handleAutoRefresh(request)

        if (refreshResult) {
          // Return response with new tokens instead of proceeding
          return refreshResult
        }
      }

      // Step 4: User is authenticated and authorized - call original handler
      console.log(`✅ Admin access granted: ${roleResult.user!.githubUsername} (${roleResult.user!.role})`)

      return await handler.apply(null, args)

    } catch (error) {
      return errorHandler(error, {
        endpoint: 'admin_middleware',
        path: request.nextUrl?.pathname
      })
    }
  }
}

// Authentication wrapper for authenticated users (any role)
export function authenticated<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  options: { requireRole?: 'admin' | 'student'; allowRefresh?: boolean } = {}
) {
  return async (...args: T) => {
    const request = args[0] as NextRequest

    try {
      // Validate authentication
      const authResult = await validateAuthToken(request)

      if (!authResult.isAuthenticated) {
        return NextResponse.json({
          success: false,
          message: authResult.error || 'Authentication required',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"'
          }
        })
      }

      // Check role authorization if specified
      const roleResult = checkRole(authResult.user!, options.requireRole)

      if (!roleResult.isAuthorized) {
        return NextResponse.json({
          success: false,
          message: 'Access denied',
          data: null,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, {
          status: 403,
          headers: {
            'X-Auth-Error': 'insufficient_permissions'
          }
        })
      }

      // Handle auto-refresh if needed
      if (authResult.needsRefresh && options.allowRefresh !== false) {
        const refreshResult = handleAutoRefresh(request)

        if (refreshResult) {
          // Return refresh response instead of proceeding
          return refreshResult
        }
      }

      console.log(`✅ Access granted: ${roleResult.user!.githubUsername} (${roleResult.user!.role})`)

      return await handler.apply(null, args)

    } catch (error) {
      return errorHandler(error, {
        endpoint: 'auth_middleware',
        path: request.nextUrl?.pathname
      })
    }
  }
}

// Generic authentication wrapper (flexible role requirements)
export function withAuth<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  options: AuthOptions = {}
) {
  const { requireAuth = true, requireRole, allowRefresh = true } = options

  // If no authentication required, just call the handler
  if (!requireAuth) {
    return handler
  }

  // Determine which authentication level to apply
  if (requireRole === 'admin') {
    return adminOnly(handler, { allowRefresh })
  }

  return authenticated(handler, { requireRole, allowRefresh })
}

// Handle automatic token refresh
function handleAutoRefresh(request: NextRequest): NextResponse | null {
  try {
    // Check if there's a valid refresh token
    const refreshToken = request.cookies.get('admin_refresh_token')?.value

    if (!refreshToken) {
      return null
    }

    // If token needs refresh, redirect to refresh endpoint
    // This could trigger a background refresh request from the client
    // For now, we'll include a hint in the response header
    console.log('🔄 Access token near expiration - client should refresh')

    // Return null to proceed with current request
    // Client application should detect and initiate refresh
    return null

  } catch (error) {
    console.error('Auto-refresh handling error:', error)
    return null
  }
}

// Utility function to get current authenticated user
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authResult = await validateAuthToken(request)

    if (authResult.isAuthenticated && authResult.user) {
      return authResult.user
    }

    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Utility to check if request is from authenticated user
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const authResult = await validateAuthToken(request)
    return authResult.isAuthenticated
  } catch (error) {
    return false
  }
}

// Export commonly used authentication wrappers
const auth = {
  // Admin-only routes
  adminOnly,

  // Any authenticated user
  authenticated,

  // Flexible authentication
  withAuth,

  // Utility functions
  getCurrentUser,
  isAuthenticated,
  validateAuthToken,
  checkRole
}

export default auth
