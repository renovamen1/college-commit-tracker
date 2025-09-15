import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/models/User'
import Class from '@/lib/models/Class'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'

/**
 * GET /api/student/dashboard - Get personalized dashboard data for logged-in student
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

    // Get student ID from cookies (assuming JWT token stores user info)
    const studentToken = request.cookies.get('admin_token')?.value

    if (!studentToken) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, { status: 401 })
    }

    // For now, we'll create a demo student ID since we don't have user authentication yet
    // In production, this would decode JWT token to get user ID
    const demoStudentId = "demo_student_id"

    await connectToDatabase()

    // Try to find student by demo ID, if not create a demo student
    let student = await User.findOne({
      $or: [
        { _id: demoStudentId },
        { githubUsername: 'student-demo', role: 'student' }
      ]
    })

    // Create demo student if not exists
    if (!student) {
      console.log('✨ Creating demo student for dashboard...')
      student = new User({
        githubUsername: 'student-demo',
        name: 'Demo Student',
        email: 'student@college.edu',
        role: 'student',
        totalCommits: 197,
        lastSyncDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await student.save()
    }

    // Get demo data since we don't have real GitHub sync yet
    const dashboardData = {
      personal: {
        totalCommits: student.totalCommits || 0,
        currentStreak: calculateStreak(),
        githubUsername: student.githubUsername,
        lastSyncDate: student.lastSyncDate,
        activeSince: student.createdAt,
        rank: await calculateStudentRank(student.githubUsername)
      },
      repositories: [
        {
          name: 'Data-Structures-Lab',
          language: 'Java',
          commits: 45,
          lastUpdate: '2 days ago'
        },
        {
          name: 'Personal-Website',
          language: 'JavaScript',
          commits: 28,
          lastUpdate: '5 days ago'
        },
        {
          name: 'Machine-Learning-Project',
          language: 'Python',
          commits: 67,
          lastUpdate: '1 week ago'
        }
      ],
      contributionCalendar: generateContributionCalendar(),
      classStanding: await getClassStanding(student._id?.toString())
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    return errorHandler(error as Error, { endpoint: 'student/dashboard', method: 'GET' })
  }
}

// Helper functions for demo data
function calculateStreak(): number {
  // Mock streak calculation
  return 5 // 5-day commit streak
}

function generateContributionCalendar() {
  // Generate mock contribution data for the past 365 days
  const calendar = []
  for (let i = 0; i < 365; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    calendar.push({
      date: date.toISOString().split('T')[0],
      commits: Math.floor(Math.random() * 8), // 0-7 commits per day
    })
  }
  return calendar.sort((a, b) => a.date.localeCompare(b.date)) // Sort by date ascending
}

async function calculateStudentRank(githubUsername: string): Promise<string> {
  // Mock ranking calculation
  // In real implementation, this would query against other students
  const mockRankings = {
    'student-demo': '#42',
    'student-alpha': '#1',
    'student-beta': '#5'
  }
  return mockRankings[githubUsername as keyof typeof mockRankings] || '#N/A'
}

async function getClassStanding(studentId: string) {
  // Mock class standing data
  return {
    className: 'Computer Science 101',
    position: 3,
    totalStudents: 45,
    averageCommits: 150,
    yourCommits: 197,
    topStudents: [
      { name: 'Alex Chen', commits: 245, position: 1 },
      { name: 'Maya Patel', commits: 223, position: 2 },
      { name: 'You', commits: 197, position: 3 },
      { name: 'Jordan Kim', commits: 189, position: 4 },
      { name: 'Taylor Swift', commits: 178, position: 5 }
    ]
  }
}
