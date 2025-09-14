import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import config from '../config'

// JWT Token Configuration
export const JWT_CONFIG = {
  accessToken: {
    expiresIn: '15m', // 15 minutes
    refreshThreshold: 5 * 60 * 1000, // Refresh 5 minutes before expiry
  },
  refreshToken: {
    expiresIn: '7d', // 7 days
    rotation: true // Rotate refresh tokens
  }
}

// Extend config to include JWT settings
declare module '../config' {
  interface Config {
    jwt: {
      secret: string
      refreshSecret: string
      accessTokenExpires: string
      refreshTokenExpires: string
    }
  }
}

// JWT Payload Interface
export interface JWTPayload {
  userId: string
  githubUsername: string
  role: 'admin' | 'student'
  sessionId: string
  iat?: number
  exp?: number
}

// Refresh Token Payload
export interface RefreshTokenPayload {
  userId: string
  sessionId: string
  tokenId: string
  iat?: number
  exp?: number
}

// Generate Access Token
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const tokenPayload: JWTPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000)
  }

  return jwt.sign(
    tokenPayload,
    config.jwt.secret,
    { expiresIn: JWT_CONFIG.accessToken.expiresIn }
  )
}

// Generate Refresh Token
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp' | 'tokenId'>): string {
  const tokenId = uuidv4()
  const tokenPayload: RefreshTokenPayload = {
    ...payload,
    tokenId,
    iat: Math.floor(Date.now() / 1000)
  }

  return jwt.sign(
    tokenPayload,
    config.jwt.refreshSecret,
    { expiresIn: JWT_CONFIG.refreshToken.expiresIn }
  )
}

// Verify Access Token
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Verify Refresh Token (without expiration check)
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, { ignoreExpiration: true }) as RefreshTokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Check if Access Token needs refresh
export function needsRefresh(token: string): boolean {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload

    if (!decoded.exp) return false

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()
    const timeUntilExpiry = expirationTime - currentTime

    return timeUntilExpiry <= JWT_CONFIG.accessToken.refreshThreshold
  } catch (error) {
    return true // If token is invalid, it needs refresh
  }
}

// Extract JWT from request (from cookie or Authorization header)
export function extractToken(request: Request): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try cookie
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookieMatch = cookieHeader.match(/admin_token=([^;]+)/)
    if (cookieMatch) {
      return decodeURIComponent(cookieMatch[1])
    }
  }

  return null
}

// Create token pair (access + refresh)
export function createTokenPair(userId: string, githubUsername: string, role: 'admin' | 'student') {
  const sessionId = uuidv4()

  const accessToken = generateAccessToken({
    userId,
    githubUsername,
    role,
    sessionId
  })

  const refreshToken = generateRefreshToken({
    userId,
    sessionId
  })

  return {
    accessToken,
    refreshToken,
    sessionId
  }
}
