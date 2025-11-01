import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, getMongoClient } from '@/lib/database'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'
import { ObjectId } from 'mongodb'

/**
 * GET /api/classes/[id] - Get detailed information about a specific class
 * Public endpoint for home classes page
 */
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

    console.log(`📊 Fetching data for class: ${params.id}`)
    await connectToDatabase()

    // Get MongoDB client using shared connection
    const { db } = await getMongoClient()

    // Find the class by ID or code
    let classData
    try {
      // Try to find by ObjectId first
      classData = await db.collection('classes').findOne({
        _id: new ObjectId(params.id),
        isActive: true
      })
    } catch (error) {
      // If not a valid ObjectId, try by code
      classData = await db.collection('classes').findOne({
        code: params.id,
        isActive: true
      })
    }

    if (!classData) {
      return NextResponse.json({
        success: false,
        message: 'Class not found',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 404 })
    }

    // Get all students in this class
    const students = await db.collection('students').find({
      classId: classData._id,
      role: 'student',
      isActive: true,
      totalCommits: { $gt: 0 }
    })
    .project({
      _id: 1,
      name: 1,
      githubUsername: 1,
      totalCommits: 1
    })
    .sort({ totalCommits: -1 })
    .toArray()

    // Calculate overview statistics
    const totalCommits = students.reduce((sum, student) => sum + (student.totalCommits || 0), 0)
    const activeContributors = students.length

    // Format member data (without lastSyncDate to avoid misleading batch sync timestamps)
    const members = students.map(student => ({
      id: student._id.toString(),
      name: student.name || student.githubUsername || 'Unknown',
      githubUsername: student.githubUsername,
      totalCommits: student.totalCommits || 0
    }))

    // Format class info
    const classInfo = {
      id: classData._id.toString(),
      name: classData.name,
      code: classData.code,
      department: classData.department,
      academicYear: classData.academicYear,
      semester: classData.semester,
      githubRepo: classData.githubRepo
    }

    const responseData = {
      overview: {
        totalCommits,
        activeContributors
      },
      members,
      classInfo,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'MongoDB Atlas Aggregations'
      }
    }

    console.log(`✅ Class ${params.id} data generated: ${activeContributors} contributors, ${totalCommits} total commits`)

    return NextResponse.json({
      success: true,
      message: 'Class data retrieved successfully',
      data: responseData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error fetching class data:', error)
    return errorHandler(error as Error, { endpoint: `classes/${params.id}`, method: 'GET' })
  }
}
