import { NextRequest } from 'next/server'
import { ZodSchema, z } from 'zod'
import { errorHandler } from './errorHandler'
import { ValidationError } from '../types/api'
import config from '../config'

// Input sanitization functions
const sanitizeInput = (input: string): string => {
  if (!input) return input

  return input
    // Remove potential XSS attacks
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '')
    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
    .replace(/javascript:[^'"\s]*/gi, '')
    .replace(/vbscript:[^'"\s]*/gi, '')
    .replace(/data:[^'"\s]*/gi, '')
    // Remove excessive whitespace
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 10000) // Prevent DoS with extremely long strings
}

// Validate request body
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  sanitize: boolean = true
): Promise<{ success: true, data: T } | { success: false, error: ReturnType<typeof errorHandler> }> {
  try {
    const body = await request.json()

    // Sanitize all string fields if requested
    if (sanitize) {
      sanitizeObjectStrings(body)
    }

    const result = schema.safeParse(body)

    if (!result.success) {
      throw new ValidationError('Request validation failed', undefined, result.error.issues)
    }

    return { success: true, data: result.data }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: errorHandler(error, { body: 'validation_failed' }) }
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      const parseError = new ValidationError('Invalid JSON format')
      return { success: false, error: errorHandler(parseError, { body: 'invalid_json' }) }
    }

    return { success: false, error: errorHandler(error as Error, { body: 'unknown_error' }) }
  }
}

// Validate query parameters
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { success: true, data: T } | { success: false, error: ReturnType<typeof errorHandler> } {
  try {
    const url = new URL(request.url)
    const queryParams: Record<string, string> = {}

    Array.from(url.searchParams.entries()).forEach(([key, value]) => {
      queryParams[key] = sanitizeInput(value)
    })

    const result = schema.safeParse(queryParams)

    if (!result.success) {
      throw new ValidationError('Query parameter validation failed', undefined, result.error.issues)
    }

    return { success: true, data: result.data }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: errorHandler(error, { query: 'validation_failed' }) }
    }

    return { success: false, error: errorHandler(error as Error, { query: 'unknown_error' }) }
  }
}

// Validate path parameters
export function validateParams<T>(
  params: Record<string, string | undefined>,
  schema: ZodSchema<T>
): { success: true, data: T } | { success: false, error: ReturnType<typeof errorHandler> } {
  try {
    // Sanitize all params
    const sanitizedParams: Record<string, string> = {}
    for (const [key, value] of Object.entries(params)) {
      sanitizedParams[key] = sanitizeInput(value || '')
    }

    const result = schema.safeParse(sanitizedParams)

    if (!result.success) {
      throw new ValidationError('Path parameter validation failed', undefined, result.error.issues)
    }

    return { success: true, data: result.data }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: errorHandler(error, { params: 'validation_failed' }) }
    }

    return { success: false, error: errorHandler(error as Error, { params: 'unknown_error' }) }
  }
}

// Recursive function to sanitize all string fields in an object
function sanitizeObjectStrings(obj: any): void {
  if (!obj || typeof obj !== 'object') return

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeInput(obj[key])
    } else if (typeof obj[key] === 'object') {
      sanitizeObjectStrings(obj[key])
    }
  }
}

// Middleware wrapper for Next.js API routes
export function withValidation<T>(
  handler: (
    request: NextRequest,
    context: any,
    data: T
  ) => Promise<Response> | Response,
  options: {
    body?: ZodSchema<any>
    query?: ZodSchema<any>
    params?: ZodSchema<any>
    bodySanitize?: boolean
  } = {}
) {
  return async (request: NextRequest, context: any) => {
    try {
      // Validate body if schema provided
      let bodyData: any = null
      if (options.body) {
        const bodyResult = await validateBody(request, options.body, options.bodySanitize)
        if (!bodyResult.success) {
          return bodyResult.error
        }
        bodyData = bodyResult.data
        // Reconstruct request with parsed body for handler
        const patchedRequest = Object.assign(request, {
          json: () => Promise.resolve(bodyData)
        }) as NextRequest
        request = patchedRequest
      }

      // Validate query parameters
      let queryData: any = null
      if (options.query) {
        const queryResult = validateQuery(request, options.query)
        if (!queryResult.success) {
          return queryResult.error
        }
        queryData = queryResult.data
      }

      // Validate path parameters
      let paramsData: any = null
      if (options.params) {
        const paramsResult = validateParams(context.params || {}, options.params)
        if (!paramsResult.success) {
          return paramsResult.error
        }
        paramsData = paramsResult.data
      }

      // Call the handler with validated data
      const validatedData = {
        body: bodyData,
        query: queryData,
        params: paramsData
      }

      return await handler(request, context, validatedData as T)

    } catch (error) {
      return errorHandler(error as Error, {
        handler: 'validation_middleware',
        path: request.nextUrl?.pathname
      })
    }
  }
}

// Common validation schemas
export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')

export const EmailSchema = z.string()
  .trim()
  .toLowerCase()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')

export const GitHubUsernameSchema = z.string()
  .trim()
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9_-])*$/, 'Invalid GitHub username')
  .min(3, 'GitHub username must be at least 3 characters')
  .max(39, 'GitHub username must be less than 40 characters')

export const UrlSchema = z.string()
  .url('Invalid URL format')
  .refine(url => !url.includes('javascript:'), 'URL cannot contain JavaScript')

// Request size validation
export const MAX_REQUEST_SIZE = 10 * 1024 * 1024 // 10MB

export function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return false
  }
  return true
}
