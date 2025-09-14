import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import Class from '@/lib/models/Class'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { PaginationSchema, CreateClassSchema, UpdateClassSchema } from '@/lib/types/api'
import config from '@/lib/config'

export async function GET(request: NextRequest) {
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

    // Validate query parameters
    const validationResult = validateQuery(request, PaginationSchema)
    if (!validationResult.success) {
      return validationResult.error
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const limit = validationResult.data.limit || 50
    const page = validationResult.data.page || 1
    const skip = (page - 1) * limit

    // Get classes with pagination
    const classes = await Class.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    // Get student counts for each class
    const classIds = classes.map(cls => cls._id)
    const studentCounts = await User.aggregate([
      {
        $match: {
          role: 'student',
          classId: { $in: classIds },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$classId',
          count: { $sum: 1 }
        }
      }
    ]).exec()

    // Format response data
    const formattedClasses = classes.map(cls => {
      const countData = studentCounts.find(count => count._id?.toString() === cls._id.toString())
      return {
        id: cls._id,
        name: cls.name,
        code: cls.code,
        department: cls.department,
        academicYear: cls.academicYear,
        semester: cls.semester,
        studentCount: countData?.count || cls.studentCount,
        totalCommits: cls.totalCommits,
        githubRepo: cls.githubRepo,
        isActive: cls.isActive,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt
      }
    })

    // Get total count for pagination metadata
    const totalClasses = await Class.countDocuments({ isActive: true })

    return NextResponse.json({
      success: true,
      message: 'Classes retrieved successfully',
      data: {
        classes: formattedClasses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalClasses / limit),
          totalItems: totalClasses,
          itemsPerPage: limit,
          hasNextPage: page * limit < totalClasses,
          hasPrevPage: page > 1
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error, { endpoint: 'classes', method: 'GET' })
  }
}

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

    // Validate request body with Zod schema
    const validationResult = await validateBody(request, CreateClassSchema, true)
    if (!validationResult.success) {
      return validationResult.error
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const classData = validationResult.data

    // Check if class with same name and department already exists
    const existingClass = await Class.findOne({
      name: classData.name,
      department: classData.department,
      isActive: true
    }).exec()

    if (existingClass) {
      return NextResponse.json({
        success: false,
        message: 'A class with this name and department already exists',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 409 })
    }

    // Create new class with enhanced model
    const newClass = new Class({
      name: classData.name,
      code: classData.code,
      department: classData.department,
      academicYear: classData.academicYear,
      semester: classData.semester,
      githubRepo: classData.githubRepo,
      studentCount: 0,
      totalCommits: 0
    })

    const savedClass = await newClass.save()

    return NextResponse.json({
      success: true,
      message: 'Class created successfully',
      data: {
        class: {
          id: savedClass._id,
          name: savedClass.name,
          code: savedClass.code,
          department: savedClass.department,
          academicYear: savedClass.academicYear,
          semester: savedClass.semester,
          githubRepo: savedClass.githubRepo,
          studentCount: savedClass.studentCount,
          totalCommits: savedClass.totalCommits,
          isActive: savedClass.isActive,
          createdAt: savedClass.createdAt,
          updatedAt: savedClass.updatedAt
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }, { status: 201 })

  } catch (error) {
    return errorHandler(error, { endpoint: 'classes', method: 'POST' })
  }
}
