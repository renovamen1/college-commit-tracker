const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Admin user creation script for initial setup
async function createAdminUser() {
  // Default admin credentials - CHANGE THESE FOR PRODUCTION
  const adminData = {
    githubUsername: 'admin12',
    email: 'admin12@codecommit.edu',
    name: 'Administrator',
    password: 'prabin12', // Change this password!
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

  try {
    console.log('🔄 Connecting to MongoDB with Mongoose...')

    // Set connection options optimized for Atlas
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000
    }

    // Connect using Mongoose
    await mongoose.connect(MONGODB_URI, connectionOptions)
    console.log('✅ Mongoose connected successfully')

    // Load User model
    const User = require('../lib/models/User').default || require('../lib/models/User')

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
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

    // Create the admin user using Mongoose model
    console.log('👤 Creating admin user...')
    const newUser = new User(adminData)
    const savedUser = await newUser.save()

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminData.email)
    console.log('🧑 Username:', adminData.githubUsername)
    console.log('🔑 Password: change wala (CHANGE THIS IMMEDIATELY)')
    console.log('🆔 User ID:', savedUser._id)
    console.log()
    console.log('⚠️  IMPORTANT: Change the default password immediately after login!')
    console.log('   Go to /admin and change password in user management section.')
    console.log()
    console.log('💡 Login URL: http://localhost:3002/admin/login')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log('🔌 Closing Mongoose connection...')
      await mongoose.connection.close()
      console.log('✅ Mongoose connection closed')
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
