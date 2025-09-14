const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Script to recreate admin user with proper password hashing
async function recreateAdminUser() {
  console.log('🔄 Recreating admin user with proper password hashing...\n')

  const MONGODB_URI = process.env.MONGODB_URI
  const DATABASE_NAME = process.env.DATABASE_NAME || 'college-commit-tracker'

  // Check if URI exists
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI environment variable not found!')
    console.log('   Make sure .env.local exists and contains MONGODB_URI')
    process.exit(1)
  }

  const adminData = {
    githubUsername: 'admin',
    email: 'admin@codecommit.edu',
    name: 'Administrator',
    password: 'admin123', // This will be hashed automatically by the model middleware
    role: 'admin',
    totalCommits: 0,
    isActive: true,
    lastSyncDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  try {
    // Connect to MongoDB
    console.log('🌐 Connecting to MongoDB with Mongoose...')
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(MONGODB_URI, connectionOptions)
    console.log('✅ Connected successfully!')

    // Load User model (which now includes password hashing middleware)
    console.log('📝 Loading User model with updated schema...')
    const User = require('../lib/models/User').default || require('../lib/models/User')

    // Delete existing admin user (if any)
    console.log('🗑️  Removing existing admin user...')
    const deleteResult = await User.deleteMany({
      role: 'admin',
      $or: [
        { githubUsername: adminData.githubUsername },
        { email: adminData.email }
      ]
    })

    if (deleteResult.deletedCount > 0) {
      console.log(`   ✅ Removed ${deleteResult.deletedCount} existing admin user(s)`)
    } else {
      console.log('   ℹ️  No existing admin users found')
    }

    // Create new admin user (password will be auto-hashed by middleware)
    console.log('👤 Creating new admin user with hashed password...')
    console.log(`   📧 Email: ${adminData.email}`)
    console.log(`   🧑 Username: ${adminData.githubUsername}`)
    console.log(`   🔑 Password: ${adminData.password} (will be hashed automatically)`)

    const newUser = new User(adminData)
    const savedUser = await newUser.save()

    console.log('✅ Admin user created successfully!')
    console.log(`🆔 User ID: ${savedUser._id}`)
    console.log(`🔐 Password hashed: ${savedUser.password !== adminData.password}`)

    // Verify password works
    console.log('\n🔍 Verifying password hashing...')
    const bcrypt = require('bcryptjs')
    const passwordMatches = await bcrypt.compare(adminData.password, savedUser.password)
    console.log(`   ✅ Original password matches hash: ${passwordMatches}`)

    console.log('\n🎉 Admin user recreation completed successfully!')
    console.log('🚀 You can now login with:')
    console.log(`   📧 Email: ${adminData.email} OR Username: ${adminData.githubUsername}`)
    console.log(`   🔑 Password: ${adminData.password}`)
    console.log(`   🎯 Login URL: http://localhost:3002/admin/login`)

  } catch (error) {
    console.error('❌ Error recreating admin user:', error.message)

    if (error.code === 11000) {
      console.log('🔐 This error usually means a unique field conflict')
      console.log('   Try running the script again or check your database')
    }

    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log('\n🔌 Closing Mongoose connection...')
      await mongoose.connection.close()
      console.log('✅ Mongoose connection closed')
    }
  }
}

// Run the script
if (require.main === module) {
  console.log('🔐 ADMIN USER RECREATION SCRIPT')
  console.log('================================')
  console.log('')
  console.log('This script will:')
  console.log('1. ✅ Connect to MongoDB Atlas')
  console.log('2. ✅ Remove existing admin user(s)')
  console.log('3. ✅ Create new admin user with hashed password')
  console.log('4. ✅ Verify password hashing works')
  console.log('')
  console.log('Current settings:')
  console.log(`Database: ${process.env.DATABASE_NAME || 'college-commit-tracker'}`)
  console.log(`URI: ${process.env.MONGODB_URI ? 'Found' : 'Not found'}`)
  console.log('')
  console.log('================================')
  console.log('')

  recreateAdminUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Script failed:', error.message)
      process.exit(1)
    })
}

module.exports = recreateAdminUser
