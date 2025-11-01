import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, getMongoClient } from '@/lib/database'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'

/**
 * GET /api/classes - Get list of all active classes
 * Public endpoint for home classes page dropdown
 */
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

    console.log('📚 Fetching list of active classes')
    await connectToDatabase()

    // Get MongoDB client using shared connection
    const { db } = await getMongoClient()

    // Get all active classes
    const classes = await db.collection('classes').find({
      isActive: true
    })
    .project({
      _id: 1,
      name: 1,
      code: 1,
      department: 1,
      academicYear: 1,
      semester: 1
    })
    .sort({ name: 1 })
    .toArray()

    // Format response data
    const formattedClasses = classes.map(cls => ({
      id: cls._id.toString(),
      name: cls.name,
      code: cls.code,
      department: cls.department,
      academicYear: cls.academicYear,
      semester: cls.semester,
      displayName: `${cls.name} (${cls.code})`
    }))

    console.log(`✅ Retrieved ${formattedClasses.length} active classes`)

    return NextResponse.json({
      success: true,
      message: 'Classes retrieved successfully',
      data: {
        classes: formattedClasses
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error fetching classes list:', error)
    return errorHandler(error as Error, { endpoint: 'classes', method: 'GET' })
  }
}
