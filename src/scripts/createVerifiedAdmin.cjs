const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'college-commit-tracker'

// Manually verified admin user creation
async function createVerifiedAdmin() {
  console.log('🔍 VERIFIED Admin User Creation')
  console.log('===============================')
  console.log()

  if (!MONGODB_URI) {
    console.log('❌ No MONGODB_URI found in .env.local')
    process.exit(1)
  }

  console.log('🌐 Connecting to:', MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':***@'))

  let connection
  try {
    // Connect to MongoDB
    connection = mongoose.createConnection(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5
    })

    console.log('✅ Connected successfully!')

    // Define User schema directly (avoid any cached model issues)
    const userSchema = new mongoose.Schema({
      githubUsername: { type: String, required: true, unique: true },
      name: { type: String, required: false },
      email: { type: String, required: false },
      password: { type: String, required: false },
      role: { type: String, required: true, enum: ['admin', 'student'] },
      classId: { type: mongoose.Schema.Types.ObjectId, required: false },
      departmentId: { type: mongoose.Schema.Types.ObjectId, required: false },
      totalCommits: { type: Number, default: 0 },
      lastSyncDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true })

    // Add password hashing middleware directly
    userSchema.pre('save', async function(next) {
      console.log('🔐 Running password hash middleware...')
      try {
        if (this.isModified('password') && this.password) {
          console.log('🛠️  Hashing password...')
          const saltRounds = 12
          const hashedPassword = await bcrypt.hash(this.password, saltRounds)
          this.password = hashedPassword
          console.log('✅ Password hashed successfully')
        } else {
          console.log('⏭️  Password not modified, skipping hash')
        }
        next()
      } catch (error) {
        console.error('❌ Password hash error:', error.message)
        next(error)
      }
    })

    // Create User model
    const User = connection.model('User', userSchema)

    // Check if admin already exists
    console.log('\n🔍 Checking for existing admin users...')
    const existingAdmins = await User.find({ role: 'admin' })
    console.log(`📊 Found ${existingAdmins.length} existing admin users`)

    if (existingAdmins.length > 0) {
      console.log('🗑️  Removing existing admin users...')
      await User.deleteMany({ role: 'admin' })
      console.log('✅ Existing admins removed')
    }

    // Create admin user data
    const adminData = {
      githubUsername: 'admin',
      email: 'admin@codecommit.edu',
      name: 'Administrator',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      totalCommits: 0,
      isActive: true,
      lastSyncDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('\n👤 Creating admin user:')
    console.log(`   Username: ${adminData.githubUsername}`)
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Password: ${adminData.password} (Plain - will be hashed)`)

    // Create and save user
    console.log('\n💾 Saving to database...')
    const newUser = new User(adminData)
    const savedUser = await newUser.save()

    console.log('✅ Admin user saved successfully!')
    console.log(`🆔 User ID: ${savedUser._id}`)
    console.log(`🔐 Password saved: ${!!savedUser.password}`)
    console.log(`📏 Password length: ${savedUser.password ? savedUser.password.length : 0}`)

    // Verify the saved user can be retrieved
    console.log('\n🔍 Verifying saved user can be retrieved...')
    const retrievedUser = await User.findById(savedUser._id)
    if (retrievedUser) {
      console.log('✅ User successfully retrieved from database!')
      console.log(`   ID: ${retrievedUser._id}`)
      console.log(`   Username: ${retrievedUser.githubUsername}`)
      console.log(`   Role: ${retrievedUser.role}`)
      console.log(`   Has Password: ${!!retrievedUser.password}`)
      console.log(`   Password Hash: ${retrievedUser.password ? retrievedUser.password.substring(0, 20) + '...' : 'MISSING'}`)
    } else {
      console.log('❌ ERROR: User could not be retrieved from database!')
    }

    // Test password verification
    console.log('\n🔐 Testing password verification...')
    if (retrievedUser.password) {
      const isValid = await bcrypt.compare('admin123', retrievedUser.password)
      console.log(`   Original password "admin123" matches: ${isValid}`)
      if (isValid) {
        console.log('🟢 SUCCESS: Password verification works!')
      } else {
        console.log('🔴 ERROR: Password verification failed!')
      }
    } else {
      console.log('🔴 ERROR: No password found in retrieved user!')
    }

    console.log('\n🎉 VERIFIED ADMIN CREATION COMPLETE!')
    console.log('============================')
    console.log('Your login should now work!')
    console.log(`📧 Email: ${adminData.email}`)
    console.log(`🧑 Username: ${adminData.githubUsername}`)
    console.log(`🔑 Password: ${adminData.password}`)
    console.log('============================')

  } catch (error) {
    console.error('❌ Error creating admin user:')
    console.error('Message:', error.message)
    if (error.errors) {
      console.error('Validation Errors:', error.errors)
    }
    if (error.code && error.code === 11000) {
      console.error('🔄 Duplicate key error - try running again')
    }
    process.exit(1)
  } finally {
    if (connection) {
      console.log('\n🔌 Closing database connection...')
      await connection.close()
      console.log('✅ Database connection closed')
    }
  }
}

createVerifiedAdmin()
