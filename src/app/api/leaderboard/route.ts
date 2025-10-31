import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'
import { MongoClient, ObjectId } from 'mongodb'

/**
 * GET /api/leaderboard - Get leaderboard data for individuals, classes, and departments
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

    console.log('📊 Fetching leaderboard data...')
    await connectToDatabase()

    // Get MongoDB client for direct queries to students collection
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')

    // Get top 50 individuals by total commits
    const topIndividuals = await db.collection('students')
      .find({ role: 'student', isActive: true, totalCommits: { $gt: 0 } })
      .project({
        _id: 1,
        name: 1,
        githubUsername: 1,
        totalCommits: 1,
        department: 1 // If we add department field later
      })
      .sort({ totalCommits: -1 })
      .limit(50)
      .toArray()

    console.log(`📊 Found ${topIndividuals.length} students with commits for leaderboard`)

    // Format individuals data
    const individuals = topIndividuals.map((student, index) => ({
      rank: index + 1,
      id: student._id.toString(),
      name: student.name || student.githubUsername || 'Unknown',
      githubUsername: student.githubUsername,
      department: student.department || 'Computer Science', // Default for now
      totalCommits: student.totalCommits || 0
    }))

    // For now, return mock data for classes and departments
    // In a real implementation, we'd aggregate by class and department fields
    const classes = [
      {
        rank: 1,
        name: 'CS101 - Intro to Programming',
        department: 'Computer Science',
        studentCount: 45,
        avgCommits: 152,
        totalCommits: 6840
      },
      {
        rank: 2,
        name: 'EE250 - Circuits & Electronics',
        department: 'Electrical Engineering',
        studentCount: 38,
        avgCommits: 145,
        totalCommits: 5510
      },
      {
        rank: 3,
        name: 'CS212 - Data Structures',
        department: 'Computer Science',
        studentCount: 35,
        avgCommits: 130,
        totalCommits: 4550
      }
    ]

    const departments = [
      {
        rank: 1,
        name: 'Computer Science',
        facultySize: 15,
        studentCount: 250,
        avgCommits: 125,
        totalCommits: 31250
      },
      {
        rank: 2,
        name: 'Electrical Engineering',
        facultySize: 12,
        studentCount: 200,
        avgCommits: 110,
        totalCommits: 22000
      },
      {
        rank: 3,
        name: 'Mathematics',
        facultySize: 20,
        studentCount: 180,
        avgCommits: 80,
        totalCommits: 14400
      }
    ]

    const leaderboardData = {
      individuals,
      classes,
      departments,
      metadata: {
        totalStudents: individuals.length,
        lastUpdated: new Date().toISOString(),
        dataSource: 'database'
      }
    }

    console.log(`✅ Leaderboard data generated: ${individuals.length} individuals, ${classes.length} classes, ${departments.length} departments`)

    return NextResponse.json({
      success: true,
      message: 'Leaderboard data retrieved successfully',
      data: leaderboardData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error fetching leaderboard data:', error)
    return errorHandler(error as Error, { endpoint: 'leaderboard', method: 'GET' })
  }
}
