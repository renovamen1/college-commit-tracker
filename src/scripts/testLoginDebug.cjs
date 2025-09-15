const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-commit-tracker'

// Debug script to test the exact login scenario
async function testLoginDebug() {
  console.log('🧪 LOGIN DEBUG TEST')
  console.log('===================')

  if (!MONGODB_URI) {
    console.log('❌ No MONGODB_URI found')
    process.exit(1)
  }

  try {
    // Connect to MongoDB (same as login route)
    console.log('🔗 Connecting with same URI...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    })
    console.log('✅ Connected!')

    // Load User model (same as login route)
    const User = require('../lib/models/User').default || require('../lib/models/User')
    console.log('📝 User model loaded')

    // Test login query (EXACT same as login route)
    const username = 'admin' // Same as test login

    console.log('\n🔍 Testing login query: Searching for user:', username)

    const user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${username}$`, 'i') } },
        { githubUsername: username }
      ],
      isActive: true
    }).select('+password').exec()

    console.log('🔍 Query result: User found?', !!user)

    if (user) {
      console.log('👤 User details:')
      console.log('  ID:', user._id?.toString())
      console.log('  Username:', user.githubUsername)
      console.log('  Email:', user.email)
      console.log('  Role:', user.role)
      console.log('  Has password:', !!user.password)
      console.log('  Password is string:', typeof user.password === 'string')
      console.log('  Password length:', user.password ? user.password.length : 'N/A')

      if (user.password && typeof user.password === 'string') {
        console.log('  Password starts with:', user.password.substring(0, 20) + '...')

        // Test password verification (same as login route)
        console.log('\n🔐 Testing password verification...')
        console.log('  Input password: "admin123"')
        const passwordMatches = await bcrypt.compare('admin123', user.password)
        console.log('  Password matches:', passwordMatches)

        if (passwordMatches) {
          console.log('🟢 LOGIN SHOULD WORK!')
        } else {
          console.log('🔴 LOGIN WILL FAIL - wrong password')
        }
      } else {
        console.log('🔴 LOGIN WILL FAIL - password is missing or wrong type')
        console.log('  Password value:', user.password)
        console.log('  Password type:', typeof user.password)
      }
    } else {
      console.log('🔴 LOGIN WILL FAIL - user not found')
    }

    // Also check all users in collection
    console.log('\n📊 All users in database:')
    const allUsers = await User.find({}).select('+password')
    console.log('Total users found:', allUsers.length)

    for (const user of allUsers) {
      console.log(`  - ${user.githubUsername} (email: ${user.email}, role: ${user.role})`)
      console.log(`    Has password: ${!!user.password}, Length: ${user.password ? user.password.length : 0}`)
    }

    console.log('\n🎯 CONCLUSION:')
    if (user && user.password && await bcrypt.compare('admin123', user.password)) {
      console.log('🟢 The login should work - user exists with correct password')
    } else {
      console.log('🔴 The login will fail with error:', !user ?
        'User not found' :
        !user.password ?
          'Password field missing' :
          'Password verification failed')
    }

  } catch (error) {
    console.log('❌ Debug test failed:', error.message)
    console.error(error)
  } finally {
    await mongoose.connection.close()
  }
}

testLoginDebug()
