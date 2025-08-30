import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Class from '@/lib/models/Class'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const classes = await Class.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec()

    // Get student counts for each class
    const classIds = classes.map(cls => cls._id)
    const studentCounts = await User.aggregate([
      {
        $match: {
          role: 'student',
          classId: { $in: classIds }
        }
      },
      {
        $group: {
          _id: '$classId',
          count: { $sum: 1 },
          totalCommits: { $sum: '$totalCommits' }
        }
      }
    ]).exec()

    const formattedClasses = classes.map(cls => {
      const countData = studentCounts.find(count => count._id?.toString() === cls._id.toString())
      return {
        id: cls._id.toString(),
        name: cls.name,
        department: cls.department,
        studentCount: countData?.count || 0,
        totalCommits: countData?.totalCommits || cls.totalCommits,
        createdAt: cls.createdAt
      }
    })

    return NextResponse.json({ classes: formattedClasses })

  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, department } = body

    if (!name || !department) {
      return NextResponse.json(
        { error: 'Class name and department are required' },
        { status: 400 }
      )
    }

    // Check if class already exists (compound unique key)
    const existingClass = await Class.findOne({ name, department }).exec()
    if (existingClass) {
      return NextResponse.json(
        { error: 'A class with this name and department already exists' },
        { status: 409 }
      )
    }

    // Create new class
    const newClass = new Class({
      name,
      department,
      studentCount: 0,
      totalCommits: 0
    })

    const savedClass = await newClass.save()

    return NextResponse.json({
      message: 'Class created successfully',
      class: {
        id: savedClass._id.toString(),
        name: savedClass.name,
        department: savedClass.department,
        studentCount: savedClass.studentCount,
        totalCommits: savedClass.totalCommits,
        createdAt: savedClass.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
