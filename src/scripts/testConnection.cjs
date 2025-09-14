const { MongoClient } = require('mongodb')
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

  let client

  try {
    console.log('\n🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      connectTimeoutMS: 10000, // 10 seconds timeout
    })

    await client.connect()
    console.log('✅ Connection successful!')

    // Test database access
    console.log('\n📊 Testing database access...')
    const db = client.db(DATABASE_NAME)
    const admin = db.admin()

    // Ping the database
    await admin.ping()
    console.log('✅ Database ping successful!')

    // List collections
    const collections = await db.listCollections().toArray()
    console.log('📋 Collections found:', collections.map(c => c.name))

    // Check if users collection exists and count documents
    const userCount = await db.collection('users').countDocuments()
    console.log('👤 Users in database:', userCount)

    // Check for admin user
    const adminUser = await db.collection('users').findOne({ role: 'admin' })
    if (adminUser) {
      console.log('👨‍💼 Admin user found:', {
        email: adminUser.email,
        githubUsername: adminUser.githubUsername,
        isActive: adminUser.isActive
      })
    } else {
      console.log('⚠️  No admin user found in database')
    }

    console.log('\n🎉 MongoDB connection test PASSED!')
    console.log('🔑 Ready for authentication!')

  } catch (error) {
    console.log('\n❌ MongoDB Connection FAILED!')
    console.log('🔧 Error details:', error.message)

    // Provide specific troubleshooting based on error type
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication Error - Check your credentials:')
      console.log('   • Username/password in connection string')
      console.log('   • Database user permissions')
      console.log('   • Network access from MongoDB Atlas')
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('connect ECONNREFUSED')) {
      console.log('\n🌐 Network Error - Check:')
      console.log('   • Internet connectivity')
      console.log('   • Firewall blocking port 27017')
      console.log('   • MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)')
    }

    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n🔗 DNS/Network Error - Check:')
      console.log('   • Cluster URL is correct')
      console.log('   • MongoDB Atlas cluster is running')
      console.log('   • No typos in connection string')
    }

    console.log('\n💡 Quick Fix Options:')
    console.log('1. 🔄 Restart MongoDB Atlas cluster')
    console.log('2. 🌐 Check MongoDB Atlas network access')
    console.log('3. 🔑 Verify credentials in connection string')
    console.log('4. ⚙️ Local fallback: MONGODB_URI=mongodb://localhost:27017/college-commit-tracker')

    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 Database connection closed')
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
