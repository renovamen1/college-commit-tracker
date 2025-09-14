import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { DATABASE_NAME } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateParams, validateRequestSize } from '@/lib/middleware/validation'
import { globalRateLimiter } from '@/lib/middleware/rateLimit'
import { z } from 'zod'
import { syncStudentCommits } from '../../route'
import config from '@/lib/config'

/**
 * POST /api/sync/student/[id] - Sync individual student commits
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    await connectToDatabase()

    // Find the student
    const user = await User.findOne({
      _id: id,
      role: 'student'
    }).select('_id githubUsername totalCommits lastSyncDate name').exec()

    if (!user) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Sync the student with progress logging
    console.log(`🚀 Starting individual sync for @${user.githubUsername}`)
    const result = await syncStudentCommits(user, (step) => {
      console.log(`[${user.name || user.githubUsername}] ${step}`)
    })

    if (result.success) {
      console.log(`✅ Successfully synced @${user.githubUsername}: ${result.oldCommits} → ${result.newCommits} commits`)

      return NextResponse.json({
        success: true,
        user: {
          id: result.id,
          githubUsername: result.githubUsername,
          name: user.name,
          oldCommits: result.oldCommits,
          newCommits: result.newCommits,
          syncTime: result.syncTime,
          lastSyncDate: new Date()
        },
        message: `Successfully synced @${user.githubUsername}`
      })
    } else {
      console.error(`❌ Failed to sync @${user.githubUsername}: ${result.error}`)

      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to sync student',
        user: {
          id: result.id,
          githubUsername: result.githubUsername,
          name: user.name
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error(`Error syncing student ${id}:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync/student/[id] - Get student's sync status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    await connectToDatabase()

    // Find the student
    const user = await User.findOne({
      _id: id,
      role: 'student'
    }).select('_id githubUsername totalCommits lastSyncDate name createdAt updatedAt').exec()

    if (!user) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const lastSyncDate = user.lastSyncDate ? new Date(user.lastSyncDate) : null
    const now = new Date()
    const daysSinceLastSync = lastSyncDate
      ? Math.floor((now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return NextResponse.json({
      student: {
        id: user._id.toString(),
        githubUsername: user.githubUsername,
        name: user.name,
        totalCommits: user.totalCommits || 0,
        lastSyncDate,
        daysSinceLastSync,
        needsSync: !lastSyncDate || daysSinceLastSync > 7, // Consider syncing if never synced or > 7 days
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error(`Error getting sync status for student ${id}:`, error)
    return NextResponse.json(
      { error: 'Failed to get student sync status' },
      { status: 500 }
    )
  }
}
