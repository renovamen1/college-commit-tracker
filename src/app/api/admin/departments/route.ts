import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Department from '@/lib/models/Department'
import Class from '@/lib/models/Class'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const page = parseInt(url.searchParams.get('page') || '1')
    const search = url.searchParams.get('search') || ''
    const skip = (page - 1) * limit

    // Build search query
    const searchQuery = search
      ? { name: { $regex: search, $options: 'i' } }
      : {}

    // Get departments with pagination
    const departments = await Department.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec()

    // Get total count for pagination
    const totalCount = await Department.countDocuments(searchQuery)

    // For each department, get the actual classes and student counts
    const departmentsWithDetails = await Promise.all(
      departments.map(async (dept) => {
        const classesInDepartment = await Class.find({
          department: dept.name
        }).select('name studentCount').exec()

        const totalStudents = await Class.aggregate([
          { $match: { department: dept.name } },
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

        return {
          id: dept._id.toString(),
          name: dept.name,
          description: dept.description,
          classes: classesInDepartment.map(cls => cls.name),
          studentCount,
          totalCommits: dept.totalCommits,
          createdAt: dept.createdAt
        }
      })
    )

    return NextResponse.json({
      departments: departmentsWithDetails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      )
    }

    // Check if department already exists
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    }).exec()

    if (existingDepartment) {
      return NextResponse.json(
        { error: 'A department with this name already exists' },
        { status: 409 }
      )
    }

    // Create new department
    const newDepartment = new Department({
      name: name.trim(),
      description: description?.trim() || '',
      classes: [],
      studentCount: 0,
      totalCommits: 0
    })

    const savedDepartment = await newDepartment.save()

    return NextResponse.json({
      message: 'Department created successfully',
      department: {
        id: savedDepartment._id.toString(),
        name: savedDepartment.name,
        description: savedDepartment.description,
        classes: savedDepartment.classes,
        studentCount: savedDepartment.studentCount,
        totalCommits: savedDepartment.totalCommits,
        createdAt: savedDepartment.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}
