import { NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from './utils'
import config from '../config'

export interface SecurityConfig {
  cors?: {
    origin: string[]
    methods: string[]
    headers: string[]
    credentials: boolean
  }
  csp?: {
    defaultSrc?: string[]
    scriptSrc?: string[]
    styleSrc?: string[]
    imgSrc?: string[]
    connectSrc?: string[]
    fontSrc?: string[]
    objectSrc?: string[]
    mediaSrc?: string[]
    frameSrc?: string[]
  }
}

// Default security configuration
const defaultSecurityConfig: SecurityConfig = {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com'] // Replace with your actual domain
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'User-Agent'
    ],
    credentials: true
  },
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com", "https://cdn.jsdelivr.net"],
    connectSrc: ["'self'", "https://api.github.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}

// Security headers middleware
export function createSecurityMiddleware(customConfig?: Partial<SecurityConfig>) {
  const securityConfig = {
    cors: { ...defaultSecurityConfig.cors, ...customConfig?.cors },
    csp: { ...defaultSecurityConfig.csp, ...customConfig?.csp }
  }

  return function securityMiddleware(request: NextRequest) {
    const response = NextResponse.next()

    // Generate and set request ID
    const requestId = generateRequestId()
    response.headers.set('X-Request-ID', requestId)

    // Security headers
    if (config.security.enableSecurityHeaders) {
      // Basic security headers
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

      // Prevent clickjacking
      response.headers.set('X-Frame-Options', 'DENY')

      // Prevent MIME type sniffing
      response.headers.set('X-Content-Type-Options', 'nosniff')

      // Enable XSS filtering
      response.headers.set('X-XSS-Protection', '1; mode=block')

      // Control referrer information
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

      // Prevent caching sensitive content
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')

      // Generate and set Content Security Policy
      const cspHeader = generateCSP(securityConfig.csp!)
      if (cspHeader) {
        response.headers.set('Content-Security-Policy', cspHeader)
      }

      // API specific headers
      if (request.nextUrl.pathname.startsWith('/api/')) {
        // Prevent caching of API responses
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')

        // Set API versioning header
        response.headers.set('X-API-Version', '1.0.0')
      }
    }

    return response
  }
}

// CORS middleware
export function createCORSMiddleware(config?: SecurityConfig['cors']) {
  const corsConfig = config || defaultSecurityConfig.cors!

  return function corsMiddleware(request: NextRequest) {
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })

      // CORS headers for preflight
      response.headers.set('Access-Control-Allow-Origin', corsConfig.origin[0] || '*')
      response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
      response.headers.set('Access-Control-Allow-Headers', corsConfig.headers.join(', '))
      response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

      if (corsConfig.credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }

      return response
    }

    // Add CORS headers to actual response
    const response = NextResponse.next()

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', corsConfig.origin[0] || '*')
    response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', corsConfig.headers.join(', '))

    if (corsConfig.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response
  }
}

// Generate Content Security Policy header
function generateCSP(csp: SecurityConfig['csp']): string {
  if (!csp) return ''

  const directives: string[] = []

  Object.entries(csp).forEach(([directive, sources]) => {
    if (sources && sources.length > 0) {
      const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase()
      if (directiveName === 'defaultSrc') {
        directives.push(`default-src ${sources.join(' ')}`)
      } else if (directiveName === 'scriptSrc') {
        directives.push(`script-src ${sources.join(' ')}`)
      } else if (directiveName === 'styleSrc') {
        directives.push(`style-src ${sources.join(' ')}`)
      } else if (directiveName === 'imgSrc') {
        directives.push(`img-src ${sources.join(' ')}`)
      } else if (directiveName === 'connectSrc') {
        directives.push(`connect-src ${sources.join(' ')}`)
      } else if (directiveName === 'fontSrc') {
        directives.push(`font-src ${sources.join(' ')}`)
      } else if (directiveName === 'objectSrc') {
        directives.push(`object-src ${sources.join(' ')}`)
      } else if (directiveName === 'mediaSrc') {
        directives.push(`media-src ${sources.join(' ')}`)
      } else if (directiveName === 'frameSrc') {
        directives.push(`frame-src ${sources.join(' ')}`)
      }
    }
  })

  // Add upgrade-insecure-requests in production
  if (config.app.nodeEnv === 'production') {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

// Default security middleware instances
export const securityHeaders = createSecurityMiddleware()
export const corsMiddleware = createCORSMiddleware()

// Combined security middleware (applies all)
export function securityMiddleware(request: NextRequest) {
  // Apply CORS first
  const response = corsMiddleware(request)

  if (response instanceof NextResponse && response.status === 200 && request.method === 'OPTIONS') {
    // Return preflight response immediately
    return response
  }

  // Apply security headers
  return securityHeaders(request)
}

// Security utility functions
export function sanitizeFileName(filename: string): string {
  // Remove path traversal attempts
  const sanitized = filename
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    .trim()

  // Limit filename length and ensure it's safe
  const safeName = sanitized.substring(0, 100)

  // Only allow alphanumeric, dots, hyphens, underscores
  return safeName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function validateFileType(
  file: File | { type: string; name: string },
  allowedTypes: string[]
): boolean {
  if (!file || !file.type) return false

  return allowedTypes.some(type =>
    file.type === type ||
    file.type.startsWith(type.split('/')[0] + '/')
  )
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Export security configuration for use in API routes
export { defaultSecurityConfig as securityConfig }

// Request size validation
export const MAX_REQUEST_SIZE = config.rateLimit.maxRequests * 1024 // Convert to KB

export function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length')

  if (contentLength) {
    const sizeInBytes = parseInt(contentLength)
    return sizeInBytes <= MAX_REQUEST_SIZE
  }

  return true // If no content-length header, assume valid
}
