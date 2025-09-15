const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-commit-tracker'

async function quickDebug() {
  try {
    console.log('🔍 Quick Debug - Connecting to:', MONGODB_URI)

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5
    })

    console.log('✅ Connected!')

    // Direct collection access - NO schema, NO model issues
    const db = mongoose.connection.db
    const usersCollection = db.collection('users')

    console.log('📇 Raw database collections:')
    const collections = await db.listCollections().toArray()
    console.log('Collections:', collections.map(c => c.name))

    console.log('\n👤 Raw users collection:')
    const rawUsers = await usersCollection.find({}).toArray()
    console.log('Total users found:', rawUsers.length)

    if (rawUsers.length > 0) {
      console.log('Sample user document:')
      console.log(JSON.stringify(rawUsers[0], null, 2))
    }

    // Try Mongoose model access
    console.log('\n🧰 Mongoose model access:')
    const User = require('../lib/models/User').default || require('../lib/models/User')

    // Find admin users specifically
    const adminUsers = await User.find({ role: 'admin' }).select('+password').lean()
    console.log('Admin users found:', adminUsers.length)

    if (adminUsers.length > 0) {
      console.log('Admin user data:')
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.githubUsername} (${user.email})`)
        console.log(`   Has password field: ${!!user.password}`)
        console.log(`   Password length: ${user.password ? user.password.length : 0}`)
      })

      // Test password verification for the most recent admin user
      const latestAdmin = adminUsers[adminUsers.length - 1]
      if (latestAdmin.password) {
        console.log('\n🔍 Testing password verification:')
        const bcrypt = require('bcryptjs')
        const isValid = await bcrypt.compare('admin123', latestAdmin.password)
        console.log(`Password 'admin123' matches: ${isValid}`)

        if (isValid) {
          console.log('🟢 SUCCESS: Password verification works!')
          console.log('🟢 Your login should work now!')
        } else {
          console.log('🔴 WARNING: Password verification failed')
          console.log('   This means the hashing is different from expected')
        }
      } else {
        console.log('🔴 ERROR: No password field found on admin user!')
        console.log('   This explains "invalid credentials" error')
      }
    } else {
      console.log('🔴 ERROR: No admin users found in database!')
      console.log('   Run: node src/scripts/recreateAdmin.cjs')
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

quickDebug()
