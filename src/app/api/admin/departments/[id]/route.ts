import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Department from '@/lib/models/Department'
import Class from '@/lib/models/Class'
import User from '@/lib/models/User'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const department = await Department.findById(params.id).exec()
    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Get classes for this department
    const classesInDepartment = await Class.find({
      department: department.name
    }).select('name studentCount').exec()

    // Get student count for this department
    const totalStudents = await Class.aggregate([
      { $match: { department: department.name } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'classId',
          as: 'students'
        }
      },
      {
        $addFields: {
          studentCount: { $size: '$students' }
        }
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: '$studentCount' }
        }
      }
    ])

    const studentCount = totalStudents.length > 0 ? totalStudents[0].totalStudents : 0

    return NextResponse.json({
      id: department._id.toString(),
      name: department.name,
      description: department.description,
      classes: classesInDepartment.map(cls => cls.name),
      studentCount,
      totalCommits: department.totalCommits,
      createdAt: department.createdAt
    })

  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { error: 'Failed to fetch department' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, description } = body

    const department = await Department.findById(params.id).exec()
    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if it conflicts
    if (name && name.trim() !== department.name) {
      const existingDepartment = await Department.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: params.id }
      }).exec()

      if (existingDepartment) {
        return NextResponse.json(
          { error: 'A department with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update department
    const updates: any = {}
    if (name !== undefined) updates.name = name.trim()
    if (description !== undefined) updates.description = description?.trim() || ''

    const updatedDepartment = await Department.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).exec()

    return NextResponse.json({
      message: 'Department updated successfully',
      department: {
        id: updatedDepartment!._id.toString(),
        name: updatedDepartment!.name,
        description: updatedDepartment!.description,
        classes: updatedDepartment!.classes,
        studentCount: updatedDepartment!.studentCount,
        totalCommits: updatedDepartment!.totalCommits,
        createdAt: updatedDepartment!.createdAt
      }
    })

  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Failed to update department' },
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

    const department = await Department.findById(params.id).exec()
    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if there are classes associated with this department
    const classesCount = await Class.countDocuments({
      department: department.name
    }).exec()

    if (classesCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department that has associated classes. Move or delete the classes first.' },
        { status: 409 }
      )
    }

    // Delete the department
    await Department.findByIdAndDelete(params.id).exec()

    return NextResponse.json({
      message: 'Department deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}
