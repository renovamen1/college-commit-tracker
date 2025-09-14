import { NextRequest } from 'next/server'

// Generate a unique request ID for tracking
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `req-${timestamp}-${random}`
}

// Generate unique identifier
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Parse and validate sort parameter
export function parseSortParam(sortStr?: string, allowedFields: string[] = []): {
  field: string
  direction: 'asc' | 'desc'
} {
  const defaultSort = { field: 'createdAt', direction: 'desc' as const }

  if (!sortStr) return defaultSort

  const [field, direction] = sortStr.split(':')

  // Validate field is allowed (if whitelist provided)
  if (allowedFields.length > 0 && !allowedFields.includes(field)) {
    return defaultSort
  }

  return {
    field,
    direction: direction === 'asc' ? 'asc' : 'desc'
  }
}

// Convert date to ISO string safely
export function safeISOString(date: Date | string | number): string {
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
    return d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

// Validate MongoDB ObjectId format
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Deep clone helper for objects
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  const clonedObj = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}

// Sanitize log message to remove sensitive data
export function sanitizeLogMessage(message: string): string {
  // Remove potential sensitive data patterns
  return message
    .replace(/[?&]token=[^&\s]*/gi, '?token=[REDACTED]')
    .replace(/[?&]password=[^&\s]*/gi, '?password=[REDACTED]')
    .replace(/[?&]key=[^&\s]*/gi, '?key=[REDACTED]')
    .replace(/"password":"[^"]*"/gi, '"password":"[REDACTED]"')
    .replace(/"token":"[^"]*"/gi, '"token":"[REDACTED]"')
    .replace(/"apiKey":"[^"]*"/gi, '"apiKey":"[REDACTED]"')
}

// Calculate age from date of birth
export function calculateAge(dob: Date | string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get pagination metadata
export function getPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    startIndex: ((page - 1) * limit) + 1,
    endIndex: Math.min(page * limit, total)
  }
}

// Validate email format more strictly
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  // Check basic format
  if (!emailRegex.test(email)) return false

  // Additional checks
  const parts = email.split('@')
  if (parts.length !== 2) return false

  const localPart = parts[0]
  const domainPart = parts[1]

  // Local part validation
  if (localPart.length === 0 || localPart.length > 64) return false
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false
  if (localPart.includes('..')) return false

  // Domain part validation
  if (domainPart.length === 0 || domainPart.length > 253) return false
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false
  if (domainPart.includes('..')) return false

  return true
}

// Sleep/delay function for testing
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get client IP from request headers
export function getClientIP(request: NextRequest): string {
  // Check various headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take first IP if multiple
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP

  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) return cfConnectingIP

  // Fallback for development
  return '127.0.0.1'
}

// Check if running in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Check if running in production mode
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

// Safe JSON parse
export function safeJSONParse(jsonString: string, fallback: any = null): any {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

// Get user agent string
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'Unknown'
}
