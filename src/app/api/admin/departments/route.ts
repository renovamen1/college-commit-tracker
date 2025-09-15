import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Department from '@/lib/models/Department'
import Class from '@/lib/models/Class'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { z } from 'zod'
import { PaginationSchema, CreateDepartmentSchema, UpdateDepartmentSchema } from '@/lib/types/api'
import config from '@/lib/config'
import { adminOnly } from '@/lib/middleware/auth'

async function handleGetDepartments(request: NextRequest) {
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

    // Extended pagination schema with search
    const searchSchema = PaginationSchema.extend({
      search: z.string().optional()
    })

    const validationResult = validateQuery(request, searchSchema)
    if (!validationResult.success) {
      const { response, statusCode } = validationResult.error as any
      return NextResponse.json(response, { status: statusCode })
    }

    // Connect to database (Mongoose handles this automatically)
    await connectToDatabase()

    const {
      limit = 10,
      page = 1,
      search = ''
    } = validationResult.data
    const skip = (page - 1) * limit

    // Build search query
    const searchQuery = search
      ? { name: { $regex: search, $options: 'i' }, isActive: true }
      : { isActive: true }

    // Get departments with pagination
    const departments = await Department.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec()

    // Get total count for pagination
    const totalCount = await Department.countDocuments(searchQuery)

    // For each department, get class and student details
    const departmentsWithDetails = await Promise.all(
      departments.map(async (dept) => {
        // Get classes in this department
        const classesInDepartment = await Class.find({
          department: dept.name,
          isActive: true
        }).select('name code').lean().exec()

        // Calculate total students across all classes in department
        const totalStudentsResult = await User.aggregate([
          {
            $lookup: {
              from: 'classes',
              localField: 'classId',
              foreignField: '_id',
              as: 'class'
            }
          },
          {
            $unwind: {
              path: '$class',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              role: 'student',
              isActive: true,
              'class.department': dept.name,
              'class.isActive': true
            }
          },
          {
            $group: {
              _id: null,
              studentCount: { $sum: 1 },
              totalCommits: { $sum: '$totalCommits' }
            }
          }
        ]).exec()

        const studentData = totalStudentsResult[0] || { studentCount: 0, totalCommits: 0 }

        return {
          id: dept._id,
          name: dept.name,
          description: dept.description,
          classes: classesInDepartment.map(cls => ({
            id: cls._id,
            name: cls.name,
            code: cls.code
          })),
          studentCount: studentData.studentCount,
          totalCommits: studentData.totalCommits,
          isActive: dept.isActive,
          createdAt: dept.createdAt,
          updatedAt: dept.updatedAt
        }
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Departments retrieved successfully',
      data: {
        departments: departmentsWithDetails,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'departments', method: 'GET' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}

async function handleCreateDepartment(request: NextRequest) {
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

    // Validate request body with Zod schema
    const validationResult = await validateBody(request, CreateDepartmentSchema, true)
    if (!validationResult.success) {
      const { response, statusCode } = validationResult.error as any
      return NextResponse.json(response, { status: statusCode })
    }

    // Connect to database (Mongoose handles this automatically)
    await connectToDatabase()

    const departmentData = validationResult.data

    // Check if department already exists (case-insensitive)
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${departmentData.name.trim()}$`, 'i') },
      isActive: true
    }).exec()

    if (existingDepartment) {
      return NextResponse.json({
        success: false,
        message: 'A department with this name already exists',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 409 })
    }

    // Create new department
    const newDepartment = new Department({
      name: departmentData.name.trim(),
      description: departmentData.description?.trim() || '',
      studentCount: 0,
      totalCommits: 0
    })

    const savedDepartment = await newDepartment.save()

    return NextResponse.json({
      success: true,
      message: 'Department created successfully',
      data: {
        department: {
          id: savedDepartment._id,
          name: savedDepartment.name,
          description: savedDepartment.description,
          classes: [],
          studentCount: savedDepartment.studentCount,
          totalCommits: savedDepartment.totalCommits,
          isActive: savedDepartment.isActive,
          createdAt: savedDepartment.createdAt,
          updatedAt: savedDepartment.updatedAt
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }, { status: 201 })

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'departments', method: 'POST' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}

// Export wrapped handlers with authentication middleware
export const GET = adminOnly(handleGetDepartments)
export const POST = adminOnly(handleCreateDepartment)
