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

    // Get top 50 individuals by total commits with department info
    const topIndividuals = await db.collection('students').aggregate([
      {
        $match: {
          role: 'student',
          isActive: true,
          totalCommits: { $gt: 0 }
        }
      },
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
        $lookup: {
          from: 'departments',
          localField: 'class.departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          githubUsername: 1,
          totalCommits: 1,
          departmentName: '$department.name',
          className: '$class.name',
          classCode: '$class.code'
        }
      },
      {
        $sort: { totalCommits: -1 }
      },
      {
        $limit: 50
      }
    ]).toArray()

    console.log(`📊 Found ${topIndividuals.length} students with commits for leaderboard`)

    // Format individuals data
    const individuals = topIndividuals.map((student, index) => ({
      rank: index + 1,
      id: student._id.toString(),
      name: student.name || student.githubUsername || 'Unknown',
      githubUsername: student.githubUsername,
      department: student.departmentName || 'Unknown Department',
      className: student.className,
      classCode: student.classCode,
      totalCommits: student.totalCommits || 0
    }))

    // Get real class rankings
    const classRankings = await db.collection('students').aggregate([
      {
        $match: {
          role: 'student',
          isActive: true,
          totalCommits: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },
      {
        $unwind: '$class'
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'class.departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$class._id',
          className: { $first: '$class.name' },
          classCode: { $first: '$class.code' },
          departmentName: { $first: '$department.name' },
          totalCommits: { $sum: '$totalCommits' },
          studentCount: { $sum: 1 },
          avgCommits: { $avg: '$totalCommits' }
        }
      },
      {
        $project: {
          _id: 0,
          classId: '$_id',
          name: {
            $concat: ['$classCode', ' - ', '$className']
          },
          department: { $ifNull: ['$departmentName', 'Unknown'] },
          studentCount: 1,
          avgCommits: { $round: ['$avgCommits', 0] },
          totalCommits: 1
        }
      },
      {
        $sort: { avgCommits: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray()

    // Format classes with rankings
    const classes = classRankings.map((cls, index) => ({
      rank: index + 1,
      name: cls.name,
      department: cls.department,
      studentCount: cls.studentCount,
      avgCommits: cls.avgCommits,
      totalCommits: cls.totalCommits
    }))

    // Get real department rankings
    const departmentRankings = await db.collection('students').aggregate([
      {
        $match: {
          role: 'student',
          isActive: true,
          totalCommits: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },
      {
        $unwind: '$class'
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'class.departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$department._id',
          departmentName: { $first: '$department.name' },
          totalCommits: { $sum: '$totalCommits' },
          studentCount: { $sum: 1 },
          avgCommits: { $avg: '$totalCommits' },
          facultySize: { $first: '$department.facultySize' }
        }
      },
      {
        $match: {
          departmentName: { $ne: null }
        }
      },
      {
        $project: {
          _id: 0,
          departmentId: '$_id',
          name: '$departmentName',
          facultySize: { $ifNull: ['$facultySize', 0] },
          studentCount: 1,
          avgCommits: { $round: ['$avgCommits', 0] },
          totalCommits: 1
        }
      },
      {
        $sort: { avgCommits: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray()

    // Format departments with rankings
    const departments = departmentRankings.map((dept, index) => ({
      rank: index + 1,
      name: dept.name,
      facultySize: dept.facultySize,
      studentCount: dept.studentCount,
      avgCommits: dept.avgCommits,
      totalCommits: dept.totalCommits
    }))

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
