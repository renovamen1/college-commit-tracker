const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

// Admin user creation script for initial setup
async function createAdminUser() {
  // Default admin credentials - CHANGE THESE FOR PRODUCTION
  const adminData = {
    githubUsername: 'admin',
    email: 'admin@codecommit.edu',
    name: 'Administrator',
    password: 'prabin11', // Change this password!
    role: 'admin',
    totalCommits: 0,
    isActive: true,
    lastSyncDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const MONGODB_URI = process.env.MONGODB_URI
  const DATABASE_NAME = process.env.DATABASE_NAME || 'college-commit-tracker'

  // Check if MongoDB URI is provided
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI environment variable not found!')
    console.log('🔧 Debugging info:')
    console.log('   File location:', __dirname + '/../../.env.local')
    console.log('   File exists:', require('fs').existsSync('.env.local'))
    console.log()
    console.log('📝 Please set up your environment variables:')
    console.log('1. Make sure .env.local file exists in project root')
    console.log('2. Set your MONGODB_URI in .env.local')
    console.log('3. Try: MONGODB_URI=mongodb://localhost:27017/college-commit-tracker')
    console.log('4. Run the script again')
    console.log()
    console.log('🧪 Test if variables load: node -e "require(\'dotenv\').config({path:\'.env.local\'}); console.log(\'MONGODB_URI:\', process.env.MONGODB_URI)"')
    process.exit(1)
  }

  let client

  try {
    console.log('🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    console.log('✅ Connected successfully')
    const db = client.db(DATABASE_NAME)

    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({
      role: 'admin',
      isActive: true
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log('   Email:', existingAdmin.email)
      console.log('   GitHub:', existingAdmin.githubUsername)
      console.log('   Use these credentials to login')
      return
    }

    // Hash the password
    console.log('🔒 Hashing password...')
    const hashedPassword = await bcrypt.hash(adminData.password, 12)
    adminData.password = hashedPassword

    // Create the admin user
    console.log('👤 Creating admin user...')
    const result = await db.collection('users').insertOne(adminData)

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminData.email)
    console.log('🧑 Username:', adminData.githubUsername)
    console.log('🔑 Password: admin123 (CHANGE THIS IMMEDIATELY)')
    console.log('🆔 User ID:', result.insertedId)
    console.log()
    console.log('⚠️  IMPORTANT: Change the default password immediately after login!')
    console.log('   Go to /admin and change password in user management section.')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the script
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('🎉 Script completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Script failed:', error.message)
      process.exit(1)
    })
}

module.exports = createAdminUser
