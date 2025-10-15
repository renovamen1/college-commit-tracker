// Simple database and model test
async function simpleDbTest() {
  console.log('🔍 SIMPLE DATABASE TEST')
  console.log('======================')

  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' })

    // Test mongoose import
    console.log('📦 Testing mongoose import...')
    const mongoose = require('mongoose')
    console.log('✅ Mongoose imported successfully')

    // Test database connection
    console.log('🔗 Testing database connection...')
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      console.log('❌ No MONGODB_URI found in .env.local')
      console.log('💡 Set your MongoDB Atlas connection string')
      return
    }

    console.log('🔌 Connecting to MongoDB Atlas...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    })

    console.log('✅ Successfully connected to MongoDB!')

    // Test User model compilation (without creating document)
    console.log('👤 Testing User model compilation...')
    // Try require syntax for CommonJS
    try {
      const UserModule = require('../lib/models/User')
      console.log('✅ User model loaded:', typeof UserModule)

      const User = UserModule.default || UserModule
      console.log('✅ User model ready:', typeof User)

      console.log('✅ ALL TESTS PASSED!')
      console.log('🔄 Dashboard should now work properly')

    } catch (modelError) {
      console.log('❌ User model error:', modelError.message)
      console.log('This may be causing the 500 error in /home/profile')
    }

    // Clean up
    await mongoose.disconnect()
    console.log('📪 Database connection closed')

  } catch (error) {
    console.error('❌ Test failed:', error.message)

    if (error.message.includes('ECONNREFUSED')) {
      console.log('🐛 Database connection refused - check MongoDB Atlas settings')
    } else if (error.message.includes('authentication failed')) {
      console.log('🐛 Database authentication failed - check username/password')
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('🐛 DNS lookup failed - check MongoDB Atlas cluster URL')
    }
  }
}

simpleDbTest()
