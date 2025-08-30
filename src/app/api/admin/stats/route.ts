import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/models/User'
import Class from '@/lib/models/Class'

export async function GET() {
  try {
    await connectToDatabase()

    // Get total student count (users with role 'student')
    const totalStudents = await User.countDocuments({
      role: 'student'
    }).exec()

    // Get total classes count
    const totalClasses = await Class.countDocuments({}).exec()

    // Get total commits tracked (sum of all users' totalCommits)
    const commitResult = await User.aggregate([
      {
        $match: { role: 'student' }
      },
      {
        $group: {
          _id: null,
          totalCommits: { $sum: '$totalCommits' }
        }
      }
    ]).exec()

    const totalCommits = commitResult.length > 0 ? commitResult[0].totalCommits : 0

    // Get last sync date (most recent lastSyncDate from any user)
    const lastSyncResult = await User.find({ lastSyncDate: { $exists: true } })
      .sort({ lastSyncDate: -1 })
      .limit(1)
      .select('lastSyncDate')
      .exec()

    const lastSyncDate = lastSyncResult.length > 0 ?
      lastSyncResult[0].lastSyncDate : null

    const stats = {
      totalStudents,
      totalClasses,
      totalCommits,
      lastSyncDate
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
