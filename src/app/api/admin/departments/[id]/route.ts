import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import Department from '@/lib/models/Department'
import Class from '@/lib/models/Class'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateParams, validateRequestSize, ObjectIdSchema } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { UpdateDepartmentSchema } from '@/lib/types/api'
import config from '@/lib/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // Find department
    const department = await Department.findById(params.id).lean().exec()
    if (!department) {
      return NextResponse.json({
        success: false,
        message: 'Department not found',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 404 })
    }

    // Get classes for this department
    const classesInDepartment = await Class.find({
      department: department.name,
      isActive: true
    }).select('name code').lean().exec()

    // Calculate total students across all classes
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
          'class.department': department.name,
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

    return NextResponse.json({
      success: true,
      message: 'Department retrieved successfully',
      data: {
        department: {
          id: department._id,
          name: department.name,
          description: department.description,
          classes: classesInDepartment.map(cls => ({
            id: cls._id,
            name: cls.name,
            code: cls.code
          })),
          studentCount: studentData.studentCount,
          totalCommits: studentData.totalCommits,
          isActive: department.isActive,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error, { endpoint: 'departments/[id]', method: 'GET', departmentId: params.id })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate and sanitize request body
    const validationResult = await validateBody(request, UpdateDepartmentSchema, true)
    if (!validationResult.success) {
      return validationResult.error
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const departmentData = validationResult.data

    // Check if department exists
    const department = await Department.findById(params.id).exec()
    if (!department) {
      return NextResponse.json({
        success: false,
        message: 'Department not found',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 404 })
    }

    // Check if name is being changed and if it conflicts
    if (departmentData.name && departmentData.name.trim() !== department.name) {
      const existingDepartment = await Department.findOne({
        name: { $regex: new RegExp(`^${departmentData.name.trim()}$`, 'i') },
        isActive: true,
        _id: { $ne: params.id }
      }).exec()

      if (existingDepartment) {
        return NextResponse.json({
          success: false,
          message: 'A department with this name already exists',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, { status: 409 })
      }
    }

    // Prepare updates
    const updates: any = {}
    if (departmentData.name !== undefined) updates.name = departmentData.name.trim()
    if (departmentData.description !== undefined) updates.description = departmentData.description?.trim() || ''

    // Update department
    const updatedDepartment = await Department.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).exec()

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully',
      data: {
        department: {
          id: updatedDepartment._id,
          name: updatedDepartment.name,
          description: updatedDepartment.description,
          classes: [],
          studentCount: updatedDepartment.studentCount,
          totalCommits: updatedDepartment.totalCommits,
          isActive: updatedDepartment.isActive,
          createdAt: updatedDepartment.createdAt,
          updatedAt: updatedDepartment.updatedAt
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error, { endpoint: 'departments/[id]', method: 'PUT', departmentId: params.id })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // Check if department exists
    const department = await Department.findById(params.id).exec()
    if (!department) {
      return NextResponse.json({
        success: false,
        message: 'Department not found',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 404 })
    }

    // Check if there are active classes associated with this department
    const classesCount = await Class.countDocuments({
      department: department.name,
      isActive: true
    }).exec()

    if (classesCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete department that has associated classes. Move or delete the classes first.',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 409 })
    }

    // Soft delete department (mark as inactive)
    await Department.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    ).exec()

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error, { endpoint: 'departments/[id]', method: 'DELETE', departmentId: params.id })
  }
}
