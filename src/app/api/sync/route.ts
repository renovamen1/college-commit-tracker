import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateBody, validateQuery, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { z } from 'zod'
import { getUserRepositories, getRepositoryCommits, validateGitHubUsername } from '@/lib/github'
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
    progressCallback?.(`Validating GitHub user @${user.githubUsername}`)
    const isValid = await validateGitHubUsername(user.githubUsername)
    if (!isValid) {
      throw new Error('GitHub username not found or account is private')
    }

    // Get all user repositories
    progressCallback?.(`Fetching repositories for @${user.githubUsername}`)
    const repositories = await getUserRepositories(user.githubUsername)

    // Count new commits since last sync
    const sinceDate = user.lastSyncDate ? new Date(user.lastSyncDate) : undefined
    let newCommitCount = 0

    // Process repositories in parallel with concurrency control
    const BATCH_SIZE = 3
    progressCallback?.(`Processing ${repositories.length} repositories for @${user.githubUsername}`)

    for (let i = 0; i < repositories.length; i += BATCH_SIZE) {
      const repoBatch = repositories.slice(i, i + BATCH_SIZE)

      const commitPromises = repoBatch.map(async (repo) => {
        try {
          progressCallback?.(`Fetching commits from ${user.githubUsername}/${repo.name}`)
          const commits = await getRepositoryCommits(user.githubUsername, repo.name, sinceDate)
          return commits.length
        } catch (error) {
          // If repository access fails (private repos, etc.), skip it
          progressCallback?.(`Skipping ${user.githubUsername}/${repo.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return 0
        }
      })

      const batchCommits = await Promise.all(commitPromises)
      newCommitCount += batchCommits.reduce((sum, count) => sum + count, 0)
    }

    // Update user with new commit count
    const updatedCommits = oldCommitCount + newCommitCount

    await User.findByIdAndUpdate(user._id, {
      totalCommits: updatedCommits,
      lastSyncDate: new Date()
    })

    const syncTime = Date.now() - startTime

    return {
      id: user._id.toString(),
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
      id: user._id.toString(),
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
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const { batchSize = 10, dryRun = false } = validationResult.data

    // Get all students
    const students = await User.find({ role: 'student', isActive: true })
      .select('_id githubUsername totalCommits lastSyncDate')
      .lean()
      .exec()

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
            id: student._id.toString(),
            githubUsername: student.githubUsername,
            error: errorMessage
          })

          return {
            id: student._id.toString(),
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
    return errorHandler(error, { endpoint: 'sync', method: 'POST' })
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
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // Get recent sync statistics with enhanced aggregation
    const [
      totalUsers,
      syncedUsers,
      recentlySyncedUsers,
      syncMetrics
    ] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({
        role: 'student',
        isActive: true,
        lastSyncDate: { $exists: true, $ne: null }
      }),
      User.find({
        role: 'student',
        isActive: true,
        lastSyncDate: { $exists: true, $ne: null }
      })
        .select('name githubUsername totalCommits lastSyncDate updatedAt')
        .sort({ lastSyncDate: -1 })
        .limit(5)
        .lean()
        .exec(),
      User.aggregate([
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
            avgSyncAge: {
              $avg: {
                $divide: [
                  { $subtract: [new Date(), '$lastSyncDate'] },
                  1000 * 60 * 60 // Convert to hours
                ]
              }
            },
            minSyncCommits: { $min: '$totalCommits' },
            maxSyncCommits: { $max: '$totalCommits' },
            latestSync: { $max: '$lastSyncDate' }
          }
        }
      ]).exec()
    ])

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
    return errorHandler(error, { endpoint: 'sync', method: 'GET' })
  }
}
