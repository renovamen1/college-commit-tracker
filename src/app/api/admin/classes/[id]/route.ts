import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Class, { IClass } from '@/lib/models/Class'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { ApiError } from '@/lib/types/api'
import { validateBody, validateParams, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { UpdateClassSchema } from '@/lib/types/api'
import { adminOnly } from '@/lib/middleware/auth'

import config from '@/lib/config'

async function handleGetClass(
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

    // Connect to database (Mongoose handles this automatically)
    await connectToDatabase()

    // Find the class
    const cls = await Class.findById(params.id).lean().exec() as unknown as IClass
    if (!cls) {
      return NextResponse.json({
        success: false,
        message: 'Class not found',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 404 })
    }

    // Get student count for this class
    const studentCount = await User.countDocuments({
      role: 'student',
      classId: params.id,
      isActive: true
    }).exec()

    return NextResponse.json({
      success: true,
      message: 'Class retrieved successfully',
      data: {
        class: {
          id: cls._id,
          name: cls.name,
          code: cls.code,
          department: cls.department,
          academicYear: cls.academicYear,
          semester: cls.semester,
          studentCount,
          totalCommits: cls.totalCommits,
          githubRepo: cls.githubRepo,
          isActive: cls.isActive,
          createdAt: cls.createdAt,
          updatedAt: cls.updatedAt
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    const errorResult = errorHandler(error as Error | ApiError, { endpoint: 'classes/[id]', method: 'GET', classId: params.id })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, department } = body

    const cls = await Class.findById(params.id).exec()
    if (!cls) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Check if name/department combination already exists (except for current class)
    if (name || department) {
      const updateQuery = {
        name: name || cls.name,
        department: department || cls.department
      }

      const existingClass = await Class.findOne({
        name: updateQuery.name,
        department: updateQuery.department,
        _id: { $ne: params.id }
      }).exec()

      if (existingClass) {
        return NextResponse.json(
          { error: 'A class with this name and department already exists' },
          { status: 409 }
        )
      }
    }

    // Update class
    const updates: any = {}
    if (name) updates.name = name.trim()
    if (department) updates.department = department.trim()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid changes provided' },
        { status: 400 }
      )
    }

    const updatedClass = await Class.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).exec()

    // Get updated student count
    const studentCount = await User.countDocuments({
      role: 'student',
      classId: params.id
    }).exec()

    return NextResponse.json({
      message: 'Class updated successfully',
      class: {
        id: updatedClass!._id.toString(),
        name: updatedClass!.name,
        department: updatedClass!.department,
        studentCount,
        totalCommits: updatedClass!.totalCommits,
        createdAt: updatedClass!.createdAt
      }
    })

  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const cls = await Class.findById(params.id).exec()
    if (!cls) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Check if there are students in this class
    const studentCount = await User.countDocuments({
      role: 'student',
      classId: params.id
    }).exec()

    if (studentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class that has students. Move students to another class first.' },
        { status: 409 }
      )
    }

    // Delete the class
    await Class.findByIdAndDelete(params.id).exec()

    return NextResponse.json({
      message: 'Class deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
