import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/models/User'
import { getUserRepositories, getRepositoryCommits, validateGitHubUsername } from '@/lib/github'

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
    await connectToDatabase()

    // Get sync parameters
    const { batchSize = 10, dryRun = false } = await request.json().catch(() => ({}))

    // Get all students
    const students = await User.find({ role: 'student' }).select('_id githubUsername totalCommits lastSyncDate').exec()

    if (students.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No students found to sync',
        totalUsers: 0,
        successful: 0,
        failed: 0,
        processedUsers: [],
        syncTime: 0
      })
    }

    const BATCH_SIZE = Math.min(batchSize, 50) // Max 50 to prevent overload
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
          const startTime = Date.now()

          const result = await syncStudentCommits(student, (step) => {
            console.log(`[${processedCount + batchIndex + 1}/${students.length}] ${step}`)
          })

          const endTime = Date.now()

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
            syncTime: Date.now() - Date.now(),
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

    const responseData: SyncResult = {
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
        }))
    }

    // Log sync summary
    console.log(`🎉 Sync completed: ${successfulCount}/${students.length} students synced successfully in ${totalSyncTime}ms`)

    if (errors.length > 0) {
      console.log(`❌ Failed to sync ${failedCount} students:`, errors.map(e => `  @${e.githubUsername}: ${e.error}`).join('\n'))
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Sync process failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during sync process',
        syncTime: 0,
        totalUsers: 0,
        successful: 0,
        failed: 0,
        processedUsers: [],
        errors: [{ error: 'Process failed' }]
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync - Get sync status and recent sync history
 */
export async function GET() {
  try {
    await connectToDatabase()

    // Get recent sync statistics
    const [
      totalUsers,
      syncedUsers,
      recentlySyncedUsers
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', lastSyncDate: { $exists: true } }),
      User.find({ role: 'student', lastSyncDate: { $exists: true } })
        .select('name githubUsername totalCommits lastSyncDate updatedAt')
        .sort({ lastSyncDate: -1 })
        .limit(5)
        .exec()
    ])

    const status = {
      totalUsers,
      syncedUsers,
      unsyncedUsers: totalUsers - syncedUsers,
      syncRate: totalUsers > 0 ? Math.round((syncedUsers / totalUsers) * 100) : 0,
      lastSync: recentlySyncedUsers.length > 0 ? recentlySyncedUsers[0].lastSyncDate : null,
      recentSyncs: recentlySyncedUsers.map(user => ({
        id: user._id,
        name: user.name,
        githubUsername: user.githubUsername,
        totalCommits: user.totalCommits,
        lastSyncDate: user.lastSyncDate,
        updatedAt: user.updatedAt
      }))
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('Failed to get sync status:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve sync status' },
      { status: 500 }
    )
  }
}
