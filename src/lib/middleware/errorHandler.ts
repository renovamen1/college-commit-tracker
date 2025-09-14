import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import {
  ApiError,
  ValidationError,
  ApiErrorType,
  ApiResponseSchema
} from '../types/api'
import config from '../config'

// Error logger function
const logError = (error: ApiError, context?: any) => {
  const errorLog = {
    message: error.message,
    type: error.errorType,
    statusCode: error.statusCode,
    field: error.field,
    details: error.details,
    context,
    timestamp: new Date().toISOString(),
    stack: config.app.nodeEnv === 'development' ? error.stack : undefined
  }

  // In production, you'd use a proper logging service (e.g., Winston, DataDog)
  if (config.app.nodeEnv === 'production') {
    console.error('❌ PRODUCTION ERROR:', JSON.stringify(errorLog, null, 2))
  } else {
    console.error('❌ DEVELOPMENT ERROR:', errorLog)
  }
}

// Convert Zod errors to structured validation errors
const formatZodError = (zodError: ZodError) => {
  const errors = zodError.issues.map((error: any) => ({
    field: error.path.join('.'),
    message: error.message,
    code: 'VALIDATION_ERROR'
  }))

  return errors
}

// Create standardized API response
function createApiResponse(
  success: boolean,
  message: string,
  data?: any,
  errors?: any[],
  statusCode: number = 200
) {
  const response: any = {
    success,
    message,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }

  if (data !== undefined) {
    response.data = data
  }

  if (errors && errors.length > 0) {
    response.errors = errors
  }

  return { response, statusCode }
}

// Global error handler middleware
export function errorHandler(error: Error | ApiError, context?: Record<string, any>) {
  let apiError: ApiError

  // Convert known errors to ApiError
  if (error instanceof ApiError) {
    apiError = error
  } else if (error instanceof ZodError) {
    const validationErrors = formatZodError(error)
    apiError = new ValidationError('Validation failed', undefined, validationErrors)
  } else if (error.name === 'ValidationError' && 'errors' in error) {
    // MongoDB validation error
    const mongoErrors = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      code: 'VALIDATION_ERROR'
    }))
    apiError = new ValidationError('Database validation failed', undefined, mongoErrors)
  } else if (error.name === 'CastError') {
    // MongoDB cast error (invalid ObjectId, etc.)
    apiError = new ApiError('Invalid data format', 400, ApiErrorType.BAD_REQUEST, error.message)
  } else if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
    // Database connection/network errors
    apiError = new ApiError('Database connection error', 503, ApiErrorType.INTERNAL)
  } else {
    // Unknown errors - treat as internal error
    apiError = new ApiError(
      config.app.nodeEnv === 'production'
        ? 'An internal error occurred'
        : error.message,
      500,
      ApiErrorType.INTERNAL,
      config.app.nodeEnv === 'development' ? error.stack : undefined
    )
  }

  // Log the error
  logError(apiError, context)

  // Create appropriate response based on error type
  switch (apiError.errorType) {
    case ApiErrorType.VALIDATION:
      return createApiResponse(
        false,
        'Validation failed',
        undefined,
        apiError.details || [{ message: apiError.message }],
        apiError.statusCode
      )

    case ApiErrorType.NOT_FOUND:
      return createApiResponse(
        false,
        apiError.message,
        undefined,
        undefined,
        404
      )

    case ApiErrorType.AUTHENTICATION:
      return createApiResponse(
        false,
        apiError.message,
        undefined,
        undefined,
        401
      )

    case ApiErrorType.AUTHORIZATION:
      return createApiResponse(
        false,
        'Access denied',
        undefined,
        undefined,
        403
      )

    case ApiErrorType.CONFLICT:
      return createApiResponse(
        false,
        apiError.message,
        undefined,
        undefined,
        409
      )

    case ApiErrorType.RATE_LIMIT:
      return createApiResponse(
        false,
        'Too many requests. Please try again later.',
        undefined,
        undefined,
        429
      )

    case ApiErrorType.INTERNAL:
    default:
      return createApiResponse(
        false,
        apiError.message,
        undefined,
        undefined,
        apiError.statusCode
      )
  }
}
