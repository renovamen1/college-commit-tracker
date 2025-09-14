import { z } from 'zod'

// Base API Response Schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string().optional()
  })).optional(),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string().optional(),
    version: z.string().optional()
  }).optional()
})

export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T
}

// Error Types
export enum ApiErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  INTERNAL = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NETWORK = 'NETWORK_ERROR'
}

// API Error Class
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errorType: ApiErrorType
  public readonly details?: any
  public readonly field?: string

  constructor(
    message: string,
    statusCode: number = 500,
    errorType: ApiErrorType = ApiErrorType.INTERNAL,
    details?: any,
    field?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorType = errorType
    this.details = details
    this.field = field

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific Error Classes for common scenarios
export class ValidationError extends ApiError {
  constructor(message: string, field?: string, details?: any) {
    super(message, 400, ApiErrorType.VALIDATION, details, field)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, ApiErrorType.AUTHENTICATION)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(message, 403, ApiErrorType.AUTHORIZATION)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, ApiErrorType.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, ApiErrorType.CONFLICT)
    this.name = 'ConflictError'
  }
}

// Input Validation Schemas
export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  githubUsername: z.string().min(1).max(39).trim()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9_-])*$/, 'Invalid GitHub username'),
  role: z.enum(['admin', 'student']),
  password: z.string().min(8).regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
    'Password must contain at least one digit, lowercase, uppercase, and special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  githubUsername: z.string().min(1).max(39).trim()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9_-])*$/, 'Invalid GitHub username').optional(),
  role: z.enum(['admin', 'student']).optional(),
  isActive: z.boolean().optional()
})

export const CreateClassSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  code: z.string().regex(/^[A-Z]{2,4}\d{3}[A-Z]?$/, 'Invalid course code (e.g., CS101)').optional(),
  department: z.string().min(2).max(50).trim(),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Invalid academic year format (YYYY-YYYY)'),
  semester: z.enum(['Fall', 'Spring', 'Summer', 'Winter']).optional(),
  githubRepo: z.string().optional()
    .refine(url => !url || z.string().url().safeParse(url).success, 'Invalid URL format')
    .refine(url => !url || url.includes('github.com'), 'Must be a GitHub repository URL')
})

export const UpdateClassSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  code: z.string().regex(/^[A-Z]{2,4}\d{3}[A-Z]?$/, 'Invalid course code (e.g., CS101)').optional(),
  department: z.string().min(2).max(50).trim().optional(),
  semester: z.enum(['Fall', 'Spring', 'Summer', 'Winter']).optional(),
  githubRepo: z.string().url().optional()
    .refine(url => !url || url.includes('github.com'), 'Must be a GitHub repository URL'),
  isActive: z.boolean().optional()
})

export const CreateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(500).trim().optional()
})

export const UpdateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(500).trim().optional()
})

// Query Parameter Schemas
export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(val => parseInt(val)).refine(val => val > 0, 'Page must be greater than 0').optional(),
  limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// Response Types
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type CreateClassInput = z.infer<typeof CreateClassSchema>
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
