import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  id: string
  githubUsername: string
  name?: string
  email?: string
  role: 'admin' | 'student'
  classId?: string
  totalCommits: number
  lastSyncDate?: Date
  createdAt: Date
}

const UserSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,
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
// But since it's required, it's fine.

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
