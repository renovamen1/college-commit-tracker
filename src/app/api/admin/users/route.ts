import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import User from '@/lib/models/User'
import Class from '@/lib/models/Class'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
// Note: Adding Zod import directly
import { z } from 'zod'
import { PaginationSchema, CreateUserSchema, UpdateUserSchema } from '@/lib/types/api'
import config from '@/lib/config'
import { getUserTotalCommits, validateGitHubUsername } from '@/lib/github'
import { adminOnly } from '@/lib/middleware/auth'

async function handleGetUsers(request: NextRequest) {
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

    // Extended pagination schema with filtering options
    const userQuerySchema = PaginationSchema.extend({
      search: z.string().optional(),
      sortBy: z.enum(['createdAt', 'totalCommits', 'githubUsername', 'name']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      role: z.enum(['admin', 'student']).optional(),
      classId: z.string().optional(),
      departmentId: z.string().optional()
    })

    // Note: Using z direct import since import statement is above
    const queryValidation = await validateQuery(request, userQuerySchema as any)
    if (!queryValidation.success) {
      const { response, statusCode } = queryValidation.error as any
      return NextResponse.json(response, { status: statusCode })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const queryData = queryValidation.data as any
    const {
      limit = 50,
      page = 1,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role = 'student',
      classId,
      departmentId
    } = queryData

    const skip = (page - 1) * limit

    // Build MongoDB query
    const query: any = { isActive: true }

    if (role) query.role = role
    if (classId) query.classId = classId
    if (departmentId) query.departmentId = departmentId

    // Add text search if provided
    if (search) {
      query.$or = [
        { githubUsername: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Get users with pagination and populate class info
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'classId',
        select: 'name code department',
        populate: {
          path: 'departmentId',
          select: 'name'
        }
      })
      .populate('departmentId', 'name')
      .lean()
      .exec()

    // Get total count for pagination
    const totalCount = await User.countDocuments(query)

    // Format response data
    const formattedUsers = users.map(user => ({
      id: user._id,
      githubUsername: user.githubUsername,
      name: user.name,
      email: user.email,
      role: user.role,
      totalCommits: user.totalCommits,
      lastSyncDate: user.lastSyncDate,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      class: user.classId ? {
        id: user.classId._id,
        name: user.classId.name,
        code: user.classId.code,
        department: user.classId.department
      } : null,
      department: user.departmentId ? {
        id: user.departmentId._id,
        name: user.departmentId.name
      } : null
    }))

    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        },
        filters: {
          search: search || null,
          role: role || null,
          classId: classId || null,
          departmentId: departmentId || null
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'users', method: 'GET' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}


// Export wrapped handlers with authentication middleware
export const GET = adminOnly(handleGetUsers)
export const POST = adminOnly(async (request: NextRequest) => {
  return handleCreateUser(request)
})

// Function declaration for POST handler
async function handleCreateUser(request: NextRequest) {
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

    // Validate and sanitize request body with Zod schema
    const validationResult = await validateBody(request, CreateUserSchema, true)
    if (!validationResult.success) {
      const { response, statusCode } = validationResult.error as any
      return NextResponse.json(response, { status: statusCode })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const userData = validationResult.data

    // Check if GitHub username already exists
    const existingUser = await User.findOne({
      githubUsername: userData.githubUsername,
      isActive: true
    }).exec()

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this GitHub username already exists',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 409 })
    }

    // Check if email already exists (case-insensitive)
    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${userData.email}$`, 'i') },
      isActive: true
    }).exec()

    if (existingEmail) {
      return NextResponse.json({
        success: false,
        message: 'User with this email address already exists',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 409 })
    }

    // Validate GitHub username with external service
    const isValidGitHub = await validateGitHubUsername(userData.githubUsername)
    if (!isValidGitHub) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or non-existent GitHub username',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 400 })
    }

    // Get initial commit count from GitHub
    let initialCommits = 0
    try {
      initialCommits = await getUserTotalCommits(userData.githubUsername) || 0
    } catch (error) {
      console.warn('Could not fetch initial commit count for', userData.githubUsername)
    }

    // Create new user with enhanced model
    const newUser = new User({
      githubUsername: userData.githubUsername,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      totalCommits: initialCommits,
      lastSyncDate: new Date(),
      password: userData.password // Will be hashed by model middleware
    })

    const savedUser = await newUser.save()

    // Class assignment can be done later if needed
    const classInfo = null // No classId in current schema

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: savedUser._id,
          githubUsername: savedUser.githubUsername,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          totalCommits: savedUser.totalCommits,
          lastSyncDate: savedUser.lastSyncDate,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
          class: classInfo
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }, { status: 201 })

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'users', method: 'POST' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}
