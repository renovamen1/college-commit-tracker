import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import User from '@/lib/models/User'
import Class from '@/lib/models/Class'
import Department from '@/lib/models/Department'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { z } from 'zod'
import config from '@/lib/config'
import { adminOnly } from '@/lib/middleware/auth'

async function handleGetStats(request: NextRequest) {
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

    // Optional query schema for statistics filtering
    const statsQuerySchema = z.object({
      timeframe: z.enum(['all', 'day', 'week', 'month', 'year']).optional(),
      departmentId: z.string().optional()
    })

    // Validate query parameters
    const validationResult = validateQuery(request, statsQuerySchema)
    if (!validationResult.success) {
      const { response, statusCode } = validationResult.error as any
      return NextResponse.json(response, { status: statusCode })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const queryData = validationResult.data
    const { timeframe = 'all', departmentId } = queryData
    const defaultTimeframe = timeframe // Store for use in catch block

    // Calculate date filter based on timeframe
    let dateFilter = {}
    if (timeframe !== 'all') {
      const now = new Date()
      const startDate = new Date(now)

      switch (timeframe) {
        case 'day':
          startDate.setDate(now.getDate() - 1)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }
      dateFilter = { createdAt: { $gte: startDate } }
    }

    // Enhanced user statistics
    const userStats = await User.aggregate([
      {
        $match: {
          isActive: true,
          role: 'student',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          totalCommits: { $sum: '$totalCommits' },
          avgCommits: { $avg: '$totalCommits' },
          activeUsers: {
            $sum: {
              $cond: [
                { $gte: ['$lastSyncDate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).exec()

    // Enhanced class statistics
    const classStats = await Class.aggregate([
      {
        $match: {
          isActive: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          avgStudentsPerClass: { $avg: '$studentCount' },
          totalStudentsInClasses: { $sum: '$studentCount' }
        }
      }
    ]).exec()

    // Department statistics
    const departmentStats = await Department.aggregate([
      {
        $match: {
          isActive: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalDepartments: { $sum: 1 }
        }
      }
    ]).exec()

    // GitHub sync activity statistics
    const syncStats = await User.aggregate([
      {
        $match: {
          role: 'student',
          lastSyncDate: { $exists: true },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          lastSyncDate: { $max: '$lastSyncDate' },
          activeSyncCount: {
            $sum: {
              $cond: [
                { $gte: ['$lastSyncDate', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).exec()

    // Most popular classes (by student count)
    const popularClasses = await Class.find({
      isActive: true,
      studentCount: { $gt: 0 }
    })
    .sort({ studentCount: -1 })
    .limit(5)
    .select('name studentCount totalCommits')
    .lean()
    .exec()

    // Calculate active departments (have classes with students)
    const activeDepartmentsArray = await Class.distinct('department', {
      isActive: true,
      studentCount: { $gt: 0 }
    })
    const activeDepartments = activeDepartmentsArray.length

    // Extract statistics with fallbacks
    const userMetrics = userStats[0] || {
      totalStudents: 0,
      totalCommits: 0,
      avgCommits: 0,
      activeUsers: 0
    }

    const classMetrics = classStats[0] || {
      totalClasses: 0,
      avgStudentsPerClass: 0,
      totalStudentsInClasses: 0
    }

    const deptMetrics = departmentStats[0] || {
      totalDepartments: 0
    }

    const syncMetrics = syncStats[0] || {
      lastSyncDate: null,
      activeSyncCount: 0
    }

    // Calculate additional metrics
    const commitGrowthRate = userMetrics.avgCommits > 0
      ? Math.round((userMetrics.totalCommits / userMetrics.avgCommits) * 100) / 100
      : 0

    const studentClassRatio = classMetrics.totalClasses > 0
      ? Math.round((classMetrics.totalStudentsInClasses / classMetrics.totalClasses) * 100) / 100
      : 0

    // Enhanced statistics response
    const statistics = {
      overview: {
        totalStudents: userMetrics.totalStudents,
        totalClasses: classMetrics.totalClasses,
        totalDepartments: deptMetrics.totalDepartments,
        totalCommits: userMetrics.totalCommits
      },
      activity: {
        lastSyncDate: syncMetrics.lastSyncDate,
        activeSyncsLastWeek: syncMetrics.activeSyncCount,
        activeUsersCount: userMetrics.activeUsers
      },
      performance: {
        averageCommitsPerStudent: Math.round(userMetrics.avgCommits * 100) / 100,
        averageStudentsPerClass: Math.round(studentClassRatio * 100) / 100,
        commitGrowthRate: commitGrowthRate,
        classFillRate: Math.round((studentClassRatio / 30) * 100) // Assuming 30 is optimal class size
      },
      insights: {
        mostPopularClasses: popularClasses.map(cls => ({
          name: cls.name,
          studentCount: cls.studentCount,
          totalCommits: cls.totalCommits
        })),
        activeDepartmentsCount: activeDepartments,
        needsAttention: {
          emptyClasses: Math.max(0, classMetrics.totalClasses - popularClasses.length),
          inactiveUsers: Math.max(0, userMetrics.totalStudents - userMetrics.activeUsers)
        }
      },
      metadata: {
        timeframe: timeframe,
        departmentFilter: departmentId || null,
        generatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: statistics,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    const errorResult = errorHandler(error as Error, { endpoint: 'stats', method: 'GET', timeframe: 'all' })
    return NextResponse.json(errorResult.response, { status: errorResult.statusCode })
  }
}

// Export wrapped handlers with authentication middleware
export const GET = adminOnly(handleGetStats)
