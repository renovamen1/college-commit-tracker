import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  githubUsername: string
  name?: string
  email?: string
  password: string
  role: 'admin' | 'student'
  classId?: mongoose.Types.ObjectId
  departmentId?: mongoose.Types.ObjectId
  totalCommits: number
  lastSyncDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema<IUser> = new Schema({
  githubUsername: {
    type: String,
    required: [true, 'GitHub username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'GitHub username must be at least 3 characters'],
    maxlength: [39, 'GitHub username must be less than 40 characters'],
    validate: {
      validator: function(v: string) {
        // GitHub username validation (alphanumeric, hyphens, underscores)
        return /^[a-zA-Z0-9](?:[a-zA-Z0-9_-])*$/.test(v)
      },
      message: 'GitHub username contains invalid characters'
    }
  },
  name: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true // Optional field
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Invalid email format'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'student'],
      message: 'Role must be either admin or student'
    },
    required: [true, 'Role is required'],
    default: 'student'
  },
  classId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Class',
    validate: {
      validator: async function(v: mongoose.Types.ObjectId) {
        if (!v) return true
        // Check if class exists
        const Class = mongoose.model('Class')
        const classExists = await Class.findById(v)
        return !!classExists
      },
      message: 'Referenced class does not exist'
    }
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Department',
    validate: {
      validator: async function(v: mongoose.Types.ObjectId) {
        if (!v) return true
        // Check if department exists
        const Department = mongoose.model('Department')
        const deptExists = await Department.findById(v)
        return !!deptExists
      },
      message: 'Referenced department does not exist'
    }
  },
  totalCommits: {
    type: Number,
    default: 0,
    min: [0, 'Total commits cannot be negative']
  },
  lastSyncDate: {
    type: Date,
    required: false
  },
  password: {
    type: String,
    required: false, // Make optional for admin creation scripts
    select: false,   // Don't include in regular queries (security)
    minlength: [8, 'Password must be at least 8 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  // Add optimistic locking for concurrent updates
  optimisticConcurrency: true
})

// Indexes for performance
UserSchema.index({ githubUsername: 1 }, { unique: true })
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ classId: 1 })
UserSchema.index({ departmentId: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: -1 })

// Compound indexes for common queries
UserSchema.index({ role: 1, isActive: 1 })
UserSchema.index({ classId: 1, isActive: 1 })

// Pre-save middleware for password hashing and validation
UserSchema.pre('save', async function(next) {
  try {
    // Hash password if it's new or modified
    if (this.isModified('password') && this.password) {
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(this.password, saltRounds)
      this.password = hashedPassword
    }

    // Validate that if classId is set, departmentId should also be set consistently
    if (this.classId && this.departmentId) {
      const Class = mongoose.model('Class')
      const classDoc = await Class.findById(this.classId)
      if (classDoc && classDoc.department !== this.departmentId.toString()) {
        next(new Error('Class and department must be consistent'))
        return
      }
    }

    next()
  } catch (error: any) {
    next(error)
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
