const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'college-commit-tracker'

// Test MongoDB Connection
async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n')

  // Check if URI exists
  if (!MONGODB_URI) {
    console.log('❌ No MONGODB_URI found in environment variables!')
    console.log('   Make sure .env.local exists and contains MONGODB_URI')
    process.exit(1)
  }

  console.log('🔗 Connection URI:', MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':***@'))
  console.log('📚 Database Name:', DATABASE_NAME)

  try {
    console.log('\n🔄 Connecting to MongoDB with Mongoose...')

    // Set connection options optimized for Atlas
    const connectionOptions = {
      // Connection timeout settings
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    }

    // Connect to MongoDB with Mongoose
    await mongoose.connect(MONGODB_URI, connectionOptions)

    console.log('✅ Mongoose connection successful!')

    // Test database access
    console.log('\n📊 Testing Mongoose operations...')

    // Get database stats
    const db = mongoose.connection.db
    const admin = db.admin()

    // Check if database exists and get stats
    const dbs = await admin.listDatabases()
    const currentDb = dbs.databases.find(dbData => dbData.name === DATABASE_NAME)
    console.log('📚 Database found:', DATABASE_NAME)
    console.log('💾 Database size:', currentDb?.sizeOnDisk ? Math.round(currentDb.sizeOnDisk / 1024 / 1024) + ' MB' : 'New database')

    // List collections
    const collections = await db.listCollections().toArray()
    console.log('📋 Collections found:', collections.length)

    // Test Mongoose models
    const User = require('../lib/models/User').default || require('../lib/models/User')
    const Class = require('../lib/models/Class').default || require('../lib/models/Class')

    const userCount = await User.countDocuments({ isActive: true, role: 'student' })
    console.log('👤 Active student users:', userCount)

    const adminUserCount = await User.countDocuments({ role: 'admin', isActive: true })
    console.log('👨‍💼 Active admin users:', adminUserCount)

    const classCount = await Class.countDocuments({ isActive: true })
    console.log('🏫 Active classes:', classCount)

    // Check for specific admin user
    const adminUser = await User.findOne({ role: 'admin', isActive: true }).select('email githubUsername isActive createdAt')
    if (adminUser) {
      console.log('👨‍💼 Admin user details:', {
        email: adminUser.email,
        githubUsername: adminUser.githubUsername,
        isActive: adminUser.isActive,
        createdAt: adminUser.createdAt.toISOString()
      })
    } else {
      console.log('⚠️  No active admin user found in database')
    }

    // Test a sample query
    const sampleUsers = await User.find({ isActive: true })
      .select('email githubUsername role')
      .limit(3)

    console.log('\n🔧 Sample users query results:')
    if (sampleUsers.length > 0) {
      sampleUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.githubUsername} (${user.role}) - ${user.email}`)
      })
    } else {
      console.log('   No users found')
    }

    console.log('\n🎉 Mongoose + MongoDB Atlas test PASSED!')
    console.log('🔑 Ready for authentication!')

  } catch (error) {
    console.log('\n❌ Mongoose Connection FAILED!')
    console.log('🔧 Error details:', error.message)

    // Provide specific troubleshooting based on error type
    if (error.message.includes('authentication failed') || error.message.includes('AuthenticationFailed')) {
      console.log('\n🔐 Authentication Error - Check your credentials:')
      console.log('   • Username/password in connection string')
      console.log('   • Database user permissions in MongoDB Atlas')
      console.log('   • Network access whitelist in MongoDB Atlas')
      console.log('   • Database cluster region settings')
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('connect ECONNREFUSED') || error.message.includes('MongooseError')) {
      console.log('\n🌐 Connection/Network Error - Check:')
      console.log('   • MongoDB Atlas cluster is awake (not paused)')
      console.log('   • IP whitelist allows your connection (try 0.0.0.0/0 for testing)')
      console.log('   • Firewall or VPN blocking the connection')
      console.log('   • Internet connectivity')
    }

    if (error.message.includes('serverSelectionTimeoutMS') || error.message.includes('specified replSet') || error.message.includes('ECONNRESET')) {
      console.log('\n⏱️  Timeout/Retry Error - Check:')
      console.log('   • MongoDB Atlas cluster status and region')
      console.log('   • Network latency or connection issues')
      console.log('   • Temporarily reduce timeout settings')
      console.log('   • Atlas Multi-region cluster stability')
    }

    if (error.message.includes('bufferCommands') || error.message.includes('unreachable khỏeSphere')) {
      console.log('\n🛠 Buffer/Command Error - This is good - it means:')
      console.log('   • Connection is established')
      console.log('   • Authentication is working')
      console.log('   • Issue is with MongoDB Atlas connection pooling')
      console.log('   • Likely a temporary network or Atlas issue')
    }

    console.log('\n💡 Quick Troubleshooting Steps:')
    console.log('1. 🔄 Go to https://cloud.mongodb.com and make sure cluster is running')
    console.log('2. 🌐 Network Access → Add IP: 0.0.0.0/0 (Allow All) for testing')
    console.log('3. 👤 Database Access → Check user permissions')
    console.log('4. 🔐 Verify connection string credentials')
    console.log('5. 🧪 Test locally: MONGODB_URI=mongodb://localhost:27017/college-commit-tracker')
    console.log('6. 🚀 Try restarting your development server: npm run dev')
    console.log()
    console.log('📝 MongoDB Atlas Troubleshooting Guide:')
    console.log('   https://docs.mongodb.com/atlas/troubleshooting-connection-issues/')

    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log('\n🔌 Closing Mongoose connection...')
      await mongoose.connection.close()
      console.log('✅ Mongoose connection closed')
    }
  }
}

// Run the test
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Test script failed:', error.message)
      process.exit(1)
    })
}

module.exports = testConnection
