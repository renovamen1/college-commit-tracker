import mongoose, { Schema } from 'mongoose'

const ClassSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
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

// Create compound unique index on name and department
ClassSchema.index({ name: 1, department: 1 }, { unique: true })

export default mongoose.models.Class || mongoose.model('Class', ClassSchema)
