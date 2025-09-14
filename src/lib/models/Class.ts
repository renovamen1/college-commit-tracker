import mongoose, { Document, Schema } from 'mongoose'

export interface IClass extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  code?: string // Course code like "CS101"
  department: string
  departmentId?: mongoose.Types.ObjectId
  instructorId?: mongoose.Types.ObjectId
  academicYear: string
  semester?: string
  studentCount: number
  totalCommits: number
  githubRepo?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ClassSchema: Schema<IClass> = new Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name must be less than 100 characters']
  },
  code: {
    type: String,
    required: false,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        // Validate course code format (should be like CS101, MTH203, etc.)
        return /^[A-Z]{2,4}\d{3}[A-Z]?$/.test(v)
      },
      message: 'Invalid course code format (should be like CS101)'
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
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
  instructorId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User', // References admin/teacher users
    validate: {
      validator: async function(v: mongoose.Types.ObjectId) {
        if (!v) return true
        // Check if user exists and has admin role
        const User = mongoose.model('User')
        const user = await User.findById(v)
        return user && user.role === 'admin'
      },
      message: 'Referenced instructor must be an admin user'
    }
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    validate: {
      validator: function(v: string) {
        // Should be in format like "2024-2025"
        return /^\d{4}-\d{4}$/.test(v)
      },
      message: 'Academic year must be in YYYY-YYYY format'
    }
  },
  semester: {
    type: String,
    required: false,
    enum: ['Fall', 'Spring', 'Summer', 'Winter'],
    default: 'Fall'
  },
  studentCount: {
    type: Number,
    default: 0,
    min: [0, 'Student count cannot be negative'],
    max: [500, 'Student count cannot exceed 500']
  },
  totalCommits: {
    type: Number,
    default: 0,
    min: [0, 'Total commits cannot be negative']
  },
  githubRepo: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        // Basic GitHub URL validation
        return /^https?:\/\/github\.com\/[^\/\s]+\/[^\/\s]+\/?$/.test(v)
      },
      message: 'Invalid GitHub repository URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  optimisticConcurrency: true
})

// Indexes for performance
ClassSchema.index({ name: 1 })
ClassSchema.index({ code: 1 })
ClassSchema.index({ department: 1 })
ClassSchema.index({ departmentId: 1 })
ClassSchema.index({ instructorId: 1 })
ClassSchema.index({ academicYear: 1 })
ClassSchema.index({ isActive: 1 })

// Compound indexes for common queries
ClassSchema.index({ name: 1, departmentId: 1 }, { unique: true })
ClassSchema.index({ departmentId: 1, isActive: 1 })
ClassSchema.index({ academicYear: 1, departmentId: 1 })

// Ensure uniqueness across active classes with same name/department
ClassSchema.index(
  { name: 1, departmentId: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
)

// Virtual for enrollment URL
ClassSchema.virtual('enrollmentUrl').get(function() {
  return `/enroll/${this._id}`
})

// Instance method to get active students count
ClassSchema.methods.getActiveStudentCount = async function(): Promise<number> {
  const User = mongoose.model('User')
  return await User.countDocuments({
    classId: this._id,
    isActive: true,
    role: 'student'
  })
}

// Static method to find by course code
ClassSchema.statics.findByCode = function(code: string) {
  return this.findOne({ code: code.toUpperCase(), isActive: true })
}

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema)
