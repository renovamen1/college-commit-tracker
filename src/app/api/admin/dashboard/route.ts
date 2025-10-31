import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Class from '@/lib/models/Class'
import Department from '@/lib/models/Department'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'

import { MongoClient } from 'mongodb'

/**
 * GET /api/admin/dashboard - Get aggregated dashboard statistics for college overview
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

    console.log('🔌 Connecting to database for dashboard stats...')
    await connectToDatabase()
    console.log('✅ Database connected successfully')

    // Get MongoDB client
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')

    // =====================================================
    // 1. TOTAL COLLEGE STATISTICS
    // =====================================================
    console.log('📊 Calculating total college statistics...')

    const totalStats = await db.collection('students').aggregate([
      {
        $match: {
          role: 'student',
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalCommits: { $sum: '$totalCommits' },
          totalContributors: { $sum: 1 },
          activeRepositories: { $sum: { $size: '$repositories' } },
          syncedStudents: {
            $sum: { $cond: ['$lastSyncDate', 1, 0] }
          },
          averageCommits: { $avg: '$totalCommits' }
        }
      }
    ]).toArray()

    const stats = totalStats[0] || {
      totalCommits: 0,
      totalContributors: 0,
      activeRepositories: 0,
      syncedStudents: 0,
      averageCommits: 0
    }

    // =====================================================
    // 2. DEPARTMENT RANKINGS
    // =====================================================
    console.log('🏛️ Calculating department rankings...')

    const departmentRankings = await db.collection('students').aggregate([
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $lookup: {
          from: 'departments',
          localField: 'class.departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      { $unwind: '$department' },
      {
        $group: {
          _id: '$department.name',
          departmentId: { $first: '$department._id' },
          totalCommits: { $sum: '$totalCommits' },
          activeStudents: { $sum: { $cond: ['$isActive', 1, 0] } },
          syncedStudents: { $sum: { $cond: ['$lastSyncDate', 1, 0] } },
          averageCommits: { $avg: '$totalCommits' }
        }
      },
      { $sort: { totalCommits: -1 } }
    ]).toArray()

    // =====================================================
    // 3. CLASS RANKINGS
    // =====================================================
    console.log('🎓 Calculating class rankings...')

    const classRankings = await db.collection('students').aggregate([
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $group: {
          _id: '$class.name',
          classId: { $first: '$class._id' },
          code: { $first: '$class.code' },
          academicYear: { $first: '$class.academicYear' },
          semester: { $first: '$class.semester' },
          totalCommits: { $sum: '$totalCommits' },
          studentCount: { $sum: 1 },
          averageCommits: { $avg: '$totalCommits' }
        }
      },
      { $sort: { averageCommits: -1 } }
    ]).toArray()

    // =====================================================
    // 4. INDIVIDUAL CONTRIBUTOR RANKINGS
    // =====================================================
    console.log('👥 Getting top individual contributors...')

    const topContributorsRaw = await db.collection('students').find({
      role: 'student',
      isActive: true,
      totalCommits: { $gt: 0 }
    })
      .sort({ totalCommits: -1 })
      .limit(10)
      .toArray()

    // Add class information via lookup
    const formattedContributors = await Promise.all(topContributorsRaw.map(async (contributor) => {
      let classInfo = {
        name: 'Unknown Class',
        code: 'Unknown',
        academicYear: 'Unknown'
      }

      if (contributor.classId) {
        try {
          const classDoc = await db.collection('classes').findOne(
            { _id: contributor.classId }
          )
          if (classDoc) {
            classInfo = {
              name: classDoc.name || 'Unknown Class',
              code: classDoc.code || 'Unknown',
              academicYear: classDoc.academicYear || 'Unknown'
            }
          }
        } catch (error) {
          // Keep default class info on error
        }
      }

      return {
        name: contributor.name,
        githubUsername: contributor.githubUsername,
        totalCommits: contributor.totalCommits,
        lastSyncDate: contributor.lastSyncDate,
        className: classInfo.name,
        classCode: classInfo.code,
        academicYear: classInfo.academicYear
      }
    }))

    // =====================================================
    // 5. ACTIVITY METRICS
    // =====================================================
    console.log('📈 Calculating activity metrics...')

    const activityMetrics = await db.collection('students').aggregate([
      {
        $match: {
          role: 'student',
          isActive: true,
          lastSyncDate: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          lastSyncTime: { $max: '$lastSyncDate' },
          activeSyncedStudents: { $sum: 1 },
          averageSyncAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$lastSyncDate'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        }
      }
    ]).toArray()

    const activity = activityMetrics[0] || {
      lastSyncTime: null,
      activeSyncedStudents: 0,
      averageSyncAge: 0
    }

    // =====================================================
    // 6. FORMAT RESPONSE
    // =====================================================

    const dashboardData = {
      overview: {
        totalCommits: stats.totalCommits,
        totalContributors: stats.totalContributors,
        activeRepositories: stats.activeRepositories,
        syncRate: stats.totalContributors > 0 ?
          Math.round((stats.syncedStudents / stats.totalContributors) * 100) : 0,
        averageCommits: Math.round(stats.averageCommits)
      },

      departmentRankings: departmentRankings.map(dept => ({
        name: dept._id,
        departmentId: dept.departmentId,
        totalCommits: dept.totalCommits,
        activeStudents: dept.activeStudents,
        syncedStudents: dept.syncedStudents,
        averageCommits: Math.round(dept.averageCommits)
      })),

      classRankings: classRankings.map(cls => ({
        name: cls._id,
        classId: cls.classId,
        code: cls.code,
        academicYear: cls.academicYear,
        semester: cls.semester,
        totalCommits: cls.totalCommits,
        studentCount: cls.studentCount,
        averageCommits: Math.round(cls.averageCommits)
      })),

      topContributors: formattedContributors,

      activityMetrics: {
        lastSyncTime: activity.lastSyncTime,
        activeSyncedStudents: activity.activeSyncedStudents,
        hoursSinceLastSync: activity.lastSyncTime ?
          Math.round((Date.now() - new Date(activity.lastSyncTime).getTime()) / (1000 * 60 * 60)) : null,
        averageSyncAgeHours: Math.round(activity.averageSyncAge)
      },

      metadata: {
        generatedAt: new Date(),
        version: '1.0.0',
        dataSource: 'MongoDB Atlas Aggregations'
      }
    }

    console.log('✅ Dashboard stats calculated successfully')
    console.log(`📊 Total Commits: ${stats.totalCommits}`)
    console.log(`🏛️ Departments: ${departmentRankings.length}`)
    console.log(`🎓 Classes: ${classRankings.length}`)
    console.log(`👥 Top Contributors: ${formattedContributors.length}`)

    return NextResponse.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: dashboardData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error calculating dashboard stats:', error)
    return errorHandler(error as Error, { endpoint: 'admin/dashboard', method: 'GET' })
  }
}

/**
 * POST /api/admin/dashboard - Trigger sync for all students and refresh dashboard
 */
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

    console.log('🔄 Triggering college-wide sync for dashboard refresh...')

    // Get all active students - FROM STUDENTS COLLECTION
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')
    const students = await db.collection('students').find({
      role: 'student',
      isActive: true
    }).toArray()

    if (students.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No active students found to sync',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      })
    }

    console.log(`🚀 Triggering sync for ${students.length} students...`)

    // Trigger batch sync for all students
    const syncResponse = await fetch(`${request.nextUrl.origin}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        batchSize: 10,
        dryRun: false
      })
    })

    if (!syncResponse.ok) {
      throw new Error(`Sync failed: ${syncResponse.status}`)
    }

    const syncResult = await syncResponse.json()

    console.log(`✅ College-wide sync completed: ${syncResult.successful}/${syncResult.totalUsers} students`)

    return NextResponse.json({
      success: true,
      message: 'College-wide sync completed successfully',
      data: {
        syncResult,
        studentsSynced: syncResult.successful,
        totalStudents: syncResult.totalUsers,
        dashboardRefresh: true
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error triggering college-wide sync:', error)
    return errorHandler(error as Error, { endpoint: 'admin/dashboard', method: 'POST' })
  }
}
