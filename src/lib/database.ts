import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  console.log('🔗 Attempting to connect to database...')

  if (cached.conn) {
    console.log('✅ Using existing cached connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('🆕 Creating new database connection...')

    // Enhanced connection options for Atlas compatibility
    const opts = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      // Retry settings
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      // SSL settings for Atlas
      ssl: true,
      sslValidate: true,
      retryWrites: true,
      retryReads: true,
      // Additional Atlas options
      family: 4,
    }

    console.log('🔄 Connecting to MongoDB (Mongoose)...')

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB (Mongoose) - Ready for authentication!')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message)
        console.error('🔧 Connection URI:', MONGODB_URI!.replace(/:([^:@]{4})[^:@]*@/, ':***@'))
        console.error('💡 Troubleshooting:')
        console.error('   • Check MongoDB Atlas network access (allow 0.0.0.0/0)')
        console.error('   • Verify Atlas cluster is not paused')
        console.error('   • Ensure database user has read/write access')
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
    console.log('✅ Database connection established successfully')
  } catch (e) {
    cached.promise = null
    console.error('❌ Failed to establish Mongoose connection:', e)
    throw e
  }

  return cached.conn
}
