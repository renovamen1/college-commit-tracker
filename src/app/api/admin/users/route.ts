import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/models/User'
import Class from '@/lib/models/Class'
import { getUserTotalCommits, validateGitHubUsername } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const recent = url.searchParams.get('recent') === 'true'
    const highCommits = url.searchParams.get('highCommits') === 'true'

    let query = { role: 'student' }
    let sort: any = {}

    if (recent) {
      // Last 10 students added
      sort = { createdAt: -1 }
    } else if (highCommits) {
      // Students with highest commits
      sort = { totalCommits: -1 }
    } else {
      // Default: all students
      sort = { createdAt: -1 }
    }

    const users = await User.find(query)
      .sort(sort)
      .limit(limit)
      .populate('classId', 'name department')
      .select('githubUsername name email totalCommits lastSyncDate createdAt')
      .exec()

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      githubUsername: user.githubUsername,
      name: user.name || user.githubUsername,
      email: user.email,
      totalCommits: user.totalCommits,
      lastSyncDate: user.lastSyncDate,
      createdAt: user.createdAt,
      className: user.classId ? `${(user.classId as any).name} - ${(user.classId as any).department}` : null
    }))

    return NextResponse.json({ users: formattedUsers })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { githubUsername, name, email, classId } = body

    if (!githubUsername) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ githubUsername }).exec()
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this GitHub username already exists' },
        { status: 409 }
      )
    }

    // Validate GitHub username
    const isValidGitHub = await validateGitHubUsername(githubUsername)
    if (!isValidGitHub) {
      return NextResponse.json(
        { error: 'Invalid GitHub username' },
        { status: 400 }
      )
    }

    // Get initial commit count
    let initialCommits = 0
    try {
      initialCommits = await getUserTotalCommits(githubUsername) || 0
    } catch (error) {
      console.warn('Could not fetch initial commit count for', githubUsername)
    }

    // Create new user
    const newUser = new User({
      githubUsername,
      name,
      email,
      role: 'student',
      totalCommits: initialCommits,
      classId: classId || null,
      lastSyncDate: new Date()
    })

    const savedUser = await newUser.save()

    return NextResponse.json({
      message: 'Student added successfully',
      user: {
        id: savedUser._id.toString(),
        githubUsername: savedUser.githubUsername,
        name: savedUser.name,
        email: savedUser.email,
        totalCommits: savedUser.totalCommits,
        createdAt: savedUser.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
