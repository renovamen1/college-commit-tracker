const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'college-commit-tracker'

async function checkRawData() {
  console.log('🔍 Checking Raw Database Data...')
  console.log('URI:', MONGODB_URI ? 'Found' : 'Missing')
  console.log('Database:', DATABASE_NAME)
  console.log()

  if (!MONGODB_URI) {
    console.log('❌ No MONGODB_URI found!')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('✅ Connecting...')
    await client.connect()

    const db = client.db(DATABASE_NAME)
    const usersCollection = db.collection('users')

    console.log('📇 Collections:')
    const collections = await db.listCollections().toArray()
    console.log(collections.map(c => c.name).join(', '))
    console.log()

    console.log('👤 ALL USERS in database (raw):')
    const allUsers = await usersCollection.find({}).toArray()
    allUsers.forEach((user, index) => {
      console.log(`\n🆔 User ${index + 1}:`)
      console.log(`  ID: ${user._id}`)
      console.log(`  Username: ${user.githubUsername}`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Role: ${user.role}`)
      console.log(`  Password: ${user.password ? `Yes (${user.password.length} chars)` : 'MISSING!'}`)
      console.log(`  Created: ${user.createdAt}`)
    })

    console.log(`\n📊 Total users: ${allUsers.length}`)

    const adminUsers = allUsers.filter(u => u.role === 'admin')
    console.log(`👨‍💼 Admin users: ${adminUsers.length}`)

    if (adminUsers.length > 0) {
      console.log('\n🔍 Latest admin user details:')
      const latestAdmin = adminUsers.reduce((latest, current) =>
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      )
      console.log({
        username: latestAdmin.githubUsername,
        email: latestAdmin.email,
        hasPassword: !!latestAdmin.password,
        passwordLength: latestAdmin.password ? latestAdmin.password.length : 0,
        createdAt: latestAdmin.createdAt
      })
    }

    console.log('\n🎯 SUCCESS: Raw data check complete!')

  } catch (error) {
    console.log('❌ Error:', error.message)
  } finally {
    await client.close()
    console.log('🔌 Connection closed')
  }
}

checkRawData()
