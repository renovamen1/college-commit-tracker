import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  githubUsername: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    required: true
  },
  classId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Class'
  },
  totalCommits: {
    type: Number,
    default: 0
  },
  lastSyncDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Unique index on githubUsername is already set above with unique: true

export default mongoose.models.User || mongoose.model('User', UserSchema)
