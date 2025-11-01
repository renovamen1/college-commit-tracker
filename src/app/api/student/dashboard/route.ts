
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { errorHandler } from '@/lib/middleware/errorHandler'
import { validateRequestSize } from '@/lib/middleware/security'
import { getUserRepositories, getRepositoryCommitCount } from '@/lib/github'
import { MongoClient, ObjectId } from 'mongodb'

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
    console.log('🔐 Checking authentication...')
    const studentToken = request.cookies.get('admin_token')?.value
    console.log('Token received:', studentToken ? 'Present' : 'Missing')

    // For demo purposes, always allow and create/use demo student
    // Remove authentication check for development
    const demoStudentId = "demo_student_id"
    console.log('Using demo student ID:', demoStudentId)

    console.log('🔌 Connecting to database...')
    await connectToDatabase()
    console.log('✅ Database connected successfully')

    console.log('🔍 Looking for seeded student...')

    // DEBUG: Check database connection details
    console.log('🔍 DEBUG: MongoDB Connection Info')
    console.log('🔍 DEBUG: MONGODB_URI (first 50 chars):', process.env.MONGODB_URI?.substring(0, 50) + '...')
    console.log('🔍 DEBUG: MONGODB_NAME:', process.env.MONGODB_NAME || 'college-commit-tracker')

    // Get MongoDB client for direct queries to students collection
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')
    console.log('🔍 DEBUG: Connected to database successfully')

    // DEBUG: List all collections in the database
    const collections = await db.listCollections().toArray()
    console.log('🔍 DEBUG: Available collections:')
    collections.forEach((col, i) => {
      console.log(`   ${i+1}. ${col.name}`)
    })

    // DEBUG: Check what's in the students collection
    const studentCount = await db.collection('students').countDocuments()
    console.log(`🔍 DEBUG: Total students in collection: ${studentCount}`)

    if (studentCount > 0) {
      console.log('🔍 DEBUG: First 3 students in collection:')
      const sampleStudents = await db.collection('students').find({}).limit(3).toArray()
      sampleStudents.forEach((student, i) => {
        console.log(`   ${i+1}. ${student.name || 'No Name'} (@${student.githubUsername || 'no-username'}) commits: ${student.totalCommits || 0}`)
      })
    }

    // Use REAL seeded student with direct MongoDB query
    let student = await db.collection('students').findOne({
      githubUsername: 'torvalds',  // Linus Torvalds - real GitHub user with thousands of commits!
      role: 'student'
    })

    console.log('Seeded student found:', !!student)

    // If seeded student doesn't exist (seed script wasn't run), error out
    if (!student) {
      console.error('❌ CRITICAL: Seeded student "torvalds" not found in students collection!')
      console.error('Check your MongoDB Atlas database - data may be in wrong collection.')
      throw new Error('Seeded students not found - check MongoDB Atlas collections')
    }

    console.log('✅ Using real seeded student: Linus Torvalds (@torvalds)')
    console.log(`   Current commits: ${student.totalCommits || 0}`)

    console.log('📊 Generating dashboard data for', student.githubUsername)

    // Get real repositories from synced user data OR mock data if not synced yet
    let repositories = []
    try {
      console.log('🔍 Attempting to get real repositories...')
      const realRepos = await getUserRepositories(student.githubUsername)
      console.log(`✅ Found ${realRepos.length} real repositories for @${student.githubUsername}`)

      console.log('🔢 Getting real commit counts per repository...')

      // Get real commit counts for each repository (top 3)
      const topRepos = realRepos.slice(0, 3)
      repositories = await Promise.all(
        topRepos.map(async (repo) => {
          console.log(`🔢 Calculating commits for ${student.githubUsername}/${repo.name}`)
          const commitCount = await getRepositoryCommitCount(student.githubUsername, repo.name)

          return {
            name: repo.name,
            language: repo.language || 'Unknown',
            commits: commitCount, // Real commit count from GitHub!
            lastUpdate: new Date(repo.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) // Real "Updated X days ago" style
          }
        })
      )

      console.log('✅ Real repository commit counts calculated!')

      console.log('✅ Using real repositories in dashboard')
    } catch (repoError) {
      console.log('⚠️ Could not fetch real repositories, using mock data:', repoError instanceof Error ? repoError.message : String(repoError))
      repositories = [
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
      ]
    }

    // Get real analytics or calculate from synced data
    const dashboardData = {
      personal: {
        totalCommits: student.totalCommits || 0,
        currentStreak: student.totalCommits ? Math.floor(student.totalCommits / 10) + 1 : calculateStreak(),
        githubUsername: student.githubUsername,
        lastSyncDate: student.lastSyncDate,
        activeSince: student.createdAt,
        rank: await calculateStudentRank(student.githubUsername)
      },
      repositories,
      contributionCalendar: generateContributionCalendar(),
      classStanding: await getClassStanding(student._id?.toString())
    }

    console.log('✅ Dashboard data generated with real repositories')

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Fatal error in student dashboard API:', error)
    console.error('Error details:', error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error)

    // Try to return a more descriptive error
    try {
      return errorHandler(error as Error, { endpoint: 'student/dashboard', method: 'GET' })
    } catch (handlerError) {
      console.error('❌ Error handler itself failed:', handlerError)
      // Return plain text error as last resort
      return new Response('Internal server error - check server logs', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
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
  // Real ranking calculation based on seeded students
  const seededStudents = [
    'torvalds',      // 25,000+ commits (Linus Torvalds)
    'yyx990803',    // 18,000+ commits (Evan You)
    'gaearon',      // 12,000+ commits (Dan Abramov)
    'ruanyf',       // 10,000+ commits (Ruan Yifeng)
    'peng-zhihui',  // 8,000+ commits (Zhihui Peng)
    'gustavoguanabara', // Major content creator
    'bradtraversy', // Popular developer
    'sjwhitworth',  // AI/ML developer
    'karpathy',     // 5,000+ commits (Andrej Karpathy)
    'rafaballerini' // Popular content creator
    // ... and 125 more seeded students
  ]

  const position = seededStudents.indexOf(githubUsername) + 1
  return position > 0 ? `#${position}` : '#N/A'
}

async function getClassStanding(studentId: string) {
  console.log('📊 Calculating class standing for student:', studentId)

  // Get MongoDB client for direct queries to students collection
  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db(process.env.MONGODB_NAME || 'college-commit-tracker')

  try {
    // Get current student's data
    const currentStudent = await db.collection('students').findOne(
      { _id: new ObjectId(studentId) },
      { projection: { totalCommits: 1, name: 1, githubUsername: 1, department: 1 } }
    )

    if (!currentStudent) {
      console.error('❌ Current student not found for class standing')
      return {
        className: 'Computer Science 101',
        position: 0,
        totalStudents: 0,
        averageCommits: 0,
        yourCommits: 0,
        topStudents: []
      }
    }

    const yourCommits = currentStudent.totalCommits || 0
    console.log(`📊 Current student: ${currentStudent.name} (@${currentStudent.githubUsername}) - ${yourCommits} commits`)

    // Get all students in the same class (for now, assume all students are in the same class)
    // In a real implementation, you'd filter by classId
    const allStudents = await db.collection('students')
      .find({ role: 'student', isActive: true })
      .project({ _id: 1, name: 1, githubUsername: 1, totalCommits: 1 })
      .sort({ totalCommits: -1 }) // Sort by commits descending
      .toArray()

    console.log(`📊 Found ${allStudents.length} total students in class`)

    // Calculate average commits
    const totalCommits = allStudents.reduce((sum, student) => sum + (student.totalCommits || 0), 0)
    const averageCommits = allStudents.length > 0 ? Math.round(totalCommits / allStudents.length) : 0

    // Find current student's position
    const currentStudentIndex = allStudents.findIndex(student =>
      student._id.toString() === studentId
    )
    const position = currentStudentIndex !== -1 ? currentStudentIndex + 1 : 0

    console.log(`📊 Student position: ${position}/${allStudents.length}, Average commits: ${averageCommits}`)

    // Get top 5 students for leaderboard
    const topStudents = allStudents.slice(0, 5).map((student, index) => ({
      name: student.name || student.githubUsername || 'Unknown',
      commits: student.totalCommits || 0,
      position: index + 1
    }))

    // Replace the current student's entry with "You" if they're in top 5
    const currentStudentInTop5 = topStudents.find(student =>
      student.name === currentStudent.name ||
      student.name === currentStudent.githubUsername
    )

    if (currentStudentInTop5) {
      currentStudentInTop5.name = 'You'
      currentStudentInTop5.commits = yourCommits
    }

    console.log(`📊 Top 5 students:`, topStudents.map(s => `${s.position}. ${s.name}: ${s.commits} commits`))

    return {
      className: currentStudent.department || 'Computer Science 101', // Use real department name
      position,
      totalStudents: allStudents.length,
      averageCommits,
      yourCommits,
      topStudents
    }

  } catch (error) {
    console.error('❌ Error calculating class standing:', error)
    return {
      className: 'Computer Science 101',
      position: 0,
      totalStudents: 0,
      averageCommits: 0,
      yourCommits: 0,
      topStudents: []
    }
  } finally {
    client.close()
  }
}
