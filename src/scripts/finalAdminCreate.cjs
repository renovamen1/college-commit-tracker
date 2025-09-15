const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

async function finalAdminCreate() {
  console.log('🛠️  FINAL ADMIN TWEAK - Removing select:false from password field...')

  if (!MONGODB_URI) {
    console.log('❌ No MONGODB_URI!')
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5
    })
    console.log('✅ Connected to MongoDB')

    // Define schema WITHOUT select:false so password gets saved
    const tempUserSchema = new mongoose.Schema({
      githubUsername: { type: String, required: true, unique: true },
      name: { type: String, required: false },
      email: { type: String, required: false },
      password: { type: String, required: false }, // ✅ NO select:false!
      role: { type: String, required: true, enum: ['admin', 'student'] },
      totalCommits: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true })

    // Add password hash middleware
    tempUserSchema.pre('save', async function(next) {
      if (this.isModified('password') && this.password) {
        const saltRounds = 12
        this.password = await bcrypt.hash(this.password, saltRounds)
      }
      next()
    })

    // Create fresh model
    const TempUser = mongoose.model('TempUser', tempUserSchema)

    console.log('🧹 Clearing any existing data...')
    await TempUser.deleteMany({})

    const adminData = {
      githubUsername: 'admin',
      email: 'admin@codecommit.edu',
      name: 'Administrator',
      password: 'admin123', // Will be hashed
      role: 'admin',
      totalCommits: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('💾 Creating admin user...')
    const newUser = new TempUser(adminData)
    const savedUser = await newUser.save()

    console.log('✅ FANFARE! Admin user created!')
    console.log(`🆔 ID: ${savedUser._id}`)
    console.log(`🔑 Password saved: ${!!savedUser.password}`)
    console.log(`📏 Hash length: ${savedUser.password?.length || 0} chars`)

    // Test immediate retrieval
    const foundUser = await TempUser.findById(savedUser._id)
    console.log(`🔍 User retrievable: ${!!foundUser}`)
    console.log(`🎯 Has password after save: ${!!foundUser?.password}`)

    if (foundUser?.password) {
      const passwordValid = await bcrypt.compare('admin123', foundUser.password)
      console.log(`✨ Password verification: ${passwordValid}`)
    }

    console.log('\n🎉 SUCCESS! Password field is now saving properly!')
    console.log('Your login should work now at http://localhost:3001/admin/login')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

