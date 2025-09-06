import mongoose, { Document, Schema } from 'mongoose'

export interface IDepartment extends Document {
  id: string
  name: string
  description?: string
  classes: string[]
  studentCount: number
  totalCommits: number
  createdAt: Date
}

const DepartmentSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  classes: [{
    type: String,
    trim: true
  }],
  studentCount: {
    type: Number,
    default: 0
  },
  totalCommits: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Create indexes
DepartmentSchema.index({ name: 1 })

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema)
