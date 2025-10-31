import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { MongoClient } from 'mongodb'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { z } from 'zod'
import { getUserRepositories, getRepositoryCommits, validateGitHubUsername, getUserTotalCommitsFromEvents, getGraphQLContributionCount } from '@/lib/github'
import config from '@/lib/config'

// Types for sync operations
interface SyncProgress {
  total: number
  processed: number
  successful: number
  failed: number
  errors: Array<{ id: string; githubUsername: string; error: string }>
}

interface SyncResult {
  success: boolean
  syncTime: number
  totalUsers: number
  successful: number
  failed: number
  errors: Array<{ id: string; githubUsername: string; error: string }>
  processedUsers: Array<{
    id: string
    githubUsername: string
    oldCommits: number
    newCommits: number
    syncTime: number
  }>
}

// Custom debounce helper
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  const debouncedFunc = function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
  debouncedFunc.cancel = () => clearTimeout(timeoutId)
  return debouncedFunc
}

// Progress callback type for SSE
type ProgressCallback = (progress: SyncProgress) => void

/**
 * Sync commits for a single student
 */
async function syncStudentCommits(
  user: any,
  progressCallback?: (step: string) => void
): Promise<{
  id: string
  githubUsername: string
  oldCommits: number
  newCommits: number
  syncTime: number
  success: boolean
  error?: string
}> {
  const startTime = Date.now()
  const oldCommitCount = user.totalCommits || 0

    try {
      // Validate GitHub username exists
      progressCallback?.(`🔍 Validating GitHub user @${user.githubUsername}`)
      const isValid = await validateGitHubUsername(user.githubUsername)
      if (!isValid) {
        throw new Error(`GitHub username @${user.githubUsername} not found or account is private`)
      }
      console.log(`✅ GitHub user @${user.githubUsername} validated`)

    // Use GraphQL API to get 365-day contribution total (includes private contributions)
    progressCallback?.(`📊 Getting total contributions for @${user.githubUsername} using GraphQL API (365 days)`)

    const totalCommits = await getGraphQLContributionCount(user.githubUsername)

    if (totalCommits === null) {
      throw new Error(`Failed to fetch contribution data for @${user.githubUsername}`)
    }

    progressCallback?.(`✅ GraphQL API: Found ${totalCommits} contributions (365-day total)`)

    // Update user with total commit count (not additive since we're getting totals)
    const updatedCommits = totalCommits

    console.log(`💾 Updating ${user.githubUsername}: ${oldCommitCount} → ${updatedCommits} commits`)

    // Use MongoDB native driver to update students collection
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')
    const updateResult = await db.collection('students').updateOne(
      { _id: user._id },
      {
        $set: {
          totalCommits: updatedCommits,
          lastSyncDate: new Date()
        }
      }
    )

    if (!updateResult) {
      throw new Error(`Failed to update user ${user.githubUsername}`)
    }

    console.log(`✅ Successfully updated ${user.githubUsername} with ${updatedCommits} commits`)

    const syncTime = Date.now() - startTime

    return {
      id: (user as any)._id.toString(),
      githubUsername: user.githubUsername,
      oldCommits: oldCommitCount,
      newCommits: updatedCommits,
      syncTime,
      success: true
    }

  } catch (error) {
    const syncTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during sync'

    // Log error for failed sync
    console.error(`Sync failed for user @${user.githubUsername}:`, errorMessage)

    return {
      id: (user as any)._id.toString(),
      githubUsername: user.githubUsername,
      oldCommits: oldCommitCount,
      newCommits: oldCommitCount,
      syncTime,
      success: false,
      error: errorMessage
    }
  }
}

/**
 * POST /api/sync - Sync all students
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

    // Validate sync parameters
    const syncParamsSchema = z.object({
      batchSize: z.number().min(1).max(50).optional().default(10),
      dryRun: z.boolean().optional().default(false)
    })

    const validationResult = await validateBody(request, syncParamsSchema, true)
    if (!validationResult.success) {
      return validationResult.error
    }

    // Connect to database
    await connectToDatabase()

    const { batchSize = 10, dryRun = false } = validationResult.data

    // Get all students - FROM STUDENTS COLLECTION
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')
    const allStudents = await db.collection('students').find({ role: 'student', isActive: true })
      .project({ _id: 1, githubUsername: 1, totalCommits: 1, lastSyncDate: 1 })
      .toArray()

    console.log(`📊 Found ${allStudents.length} students in database`)

    // Sync all active students (no limit for production)
    const students = allStudents

    console.log(`🔄 Syncing all ${students.length} students`)

    if (students.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active students found to sync',
        totalUsers: 0,
        successful: 0,
        failed: 0,
        processedUsers: [],
        syncTime: 0,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      })
    }

    const BATCH_SIZE = batchSize // Already validated to be 1-50
    const results: Array<any> = []
    let processedCount = 0
    let successfulCount = 0
    let failedCount = 0
    const errors: Array<{ id: string; githubUsername: string; error: string }> = []

    const totalStartTime = Date.now()

    // Process students in batches
    for (let i = 0; i < students.length; i += BATCH_SIZE) {
      const batch = students.slice(i, i + BATCH_SIZE)

      // Process batch in parallel with controlled concurrency
      const batchPromises = batch.map(async (student, batchIndex) => {
        try {
          const result = await syncStudentCommits(student, (step) => {
            console.log(`[${processedCount + batchIndex + 1}/${students.length}] ${step}`)
          })

          if (result.success) {
            successfulCount++
          } else {
            failedCount++
            errors.push({
              id: result.id,
              githubUsername: result.githubUsername,
              error: result.error || 'Unknown error'
            })
          }

          return result

        } catch (error) {
          failedCount++
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          errors.push({
            id: (student as any)._id.toString(),
            githubUsername: student.githubUsername,
            error: errorMessage
          })

          return {
            id: (student as any)._id.toString(),
            githubUsername: student.githubUsername,
            oldCommits: student.totalCommits || 0,
            newCommits: student.totalCommits || 0,
            syncTime: 0,
            success: false,
            error: errorMessage
          }
        }
      })

      // Wait for current batch to complete before starting next batch
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      processedCount += batch.length

      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed: ${successfulCount}/${processedCount} successful`)

      // Add small delay between batches to be respectful to GitHub API
      if (i + BATCH_SIZE < students.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const totalSyncTime = Date.now() - totalStartTime

    // Filter successful results for response
    const successfulResults = results.filter(result => result.success)

    const responseData: SyncResult & { timestamp: string; version: string } = {
      success: successfulCount > 0,
      syncTime: totalSyncTime,
      totalUsers: students.length,
      successful: successfulCount,
      failed: failedCount,
      errors,
      processedUsers: dryRun ?
        [] :
        successfulResults.map(result => ({
          id: result.id,
          githubUsername: result.githubUsername,
          oldCommits: result.oldCommits,
          newCommits: result.newCommits,
          syncTime: result.syncTime
        })),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }

    // Log sync summary
    console.log(`🎉 Sync completed: ${successfulCount}/${students.length} students synced successfully in ${totalSyncTime}ms`)

    if (errors.length > 0) {
      console.log(`❌ Failed to sync ${failedCount} students:`, errors.map(e => `  @${e.githubUsername}: ${e.error}`).join('\n'))
    }

    return NextResponse.json(responseData)

  } catch (error) {
    return errorHandler(error as Error, { endpoint: 'sync', method: 'POST' })
  }
}

/**
 * GET /api/sync - Get sync status and recent sync history
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

    // Connect to database
    await connectToDatabase()

    // Get recent sync statistics with enhanced aggregation - FROM STUDENTS COLLECTION
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')

    const [
      totalUsers,
      syncedUsersData,
      syncMetricsData
    ] = await Promise.all([
      db.collection('students').countDocuments({ role: 'student', isActive: true }),
      db.collection('students').find({
        role: 'student',
        isActive: true,
        lastSyncDate: { $exists: true, $ne: null }
      }).sort({ lastSyncDate: -1 }).limit(5).toArray(),
      db.collection('students').find({
        role: 'student',
        isActive: true,
        lastSyncDate: { $exists: true, $ne: null }
      }).toArray()
    ])

    const syncedUsers = syncedUsersData.length
    const allSyncedUsers = syncMetricsData

    // Calculate sync metrics
    let avgSyncAge = 0
    let minSyncCommits = Infinity
    let maxSyncCommits = 0
    let latestSync: Date | null = null

    if (allSyncedUsers.length > 0) {
      const totalAge = allSyncedUsers.reduce((sum, user) => {
        if (user.lastSyncDate) {
          const age = (Date.now() - new Date(user.lastSyncDate).getTime()) / (1000 * 60 * 60)
          return sum + age
        }
        return sum
      }, 0)
      avgSyncAge = totalAge / allSyncedUsers.length

      allSyncedUsers.forEach(user => {
        minSyncCommits = Math.min(minSyncCommits, user.totalCommits || 0)
        maxSyncCommits = Math.max(maxSyncCommits, user.totalCommits || 0)
        if (!latestSync || (user.lastSyncDate && user.lastSyncDate > latestSync)) {
          latestSync = user.lastSyncDate
        }
      })
    }

    const recentlySyncedUsers = syncedUsersData
    const syncMetrics = [{
      avgSyncAge,
      minSyncCommits: minSyncCommits === Infinity ? 0 : minSyncCommits,
      maxSyncCommits,
      latestSync
    }]

    const metrics = syncMetrics[0] || {
      avgSyncAge: 0,
      minSyncCommits: 0,
      maxSyncCommits: 0,
      latestSync: null
    }

    const status = {
      overview: {
        totalUsers,
        syncedUsers,
        unsyncedUsers: totalUsers - syncedUsers,
        syncRate: totalUsers > 0 ? Math.round((syncedUsers / totalUsers) * 100) : 0,
        activeSyncRate: syncedUsers > 0 ? Math.round((metrics.avgSyncAge <= 24 ? syncedUsers : 0) / syncedUsers * 100) : 0
      },
      activity: {
        lastSync: metrics.latestSync,
        averageSyncAgeHours: Math.round(metrics.avgSyncAge * 100) / 100,
        syncRange: {
          minCommits: metrics.minSyncCommits || 0,
          maxCommits: metrics.maxSyncCommits || 0
        }
      },
      recentSyncs: recentlySyncedUsers.map(user => ({
        id: user._id,
        name: user.name || user.githubUsername,
        githubUsername: user.githubUsername,
        totalCommits: user.totalCommits,
        lastSyncDate: user.lastSyncDate,
        updatedAt: user.updatedAt,
        syncAgeHours: user.lastSyncDate ?
          Math.round((Date.now() - new Date(user.lastSyncDate).getTime()) / (1000 * 60 * 60) * 100) / 100 :
          null
      }))
    }

    return NextResponse.json({
      success: true,
      message: 'Sync status retrieved successfully',
      data: status,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error as Error, { endpoint: 'sync', method: 'GET' })
  }
}

export { syncStudentCommits }
