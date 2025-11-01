import mongoose from 'mongoose'
import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_NAME || 'college-commit-tracker'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global cache for connections to prevent connection leaks
 */
let cached = (global as any).database

if (!cached) {
  cached = (global as any).database = {
    mongoose: { conn: null, promise: null },
    mongodb: { client: null, db: null, promise: null }
  }
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
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      // SSL settings for Atlas
      ssl: true,
      // Retry settings
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

// =============================================================================
// NATIVE MONGODB CLIENT (for complex aggregations)
// =============================================================================

export async function getMongoClient(): Promise<{ client: MongoClient; db: Db }> {
  console.log('🔗 Attempting to get MongoDB client...')

  if (cached.mongodb.client && cached.mongodb.db) {
    console.log('✅ Using existing cached MongoDB client')
    return { client: cached.mongodb.client, db: cached.mongodb.db }
  }

  if (!cached.mongodb.promise) {
    console.log('🆕 Creating new MongoDB client connection...')

    // Connection options optimized for Atlas free tier
    const client = new MongoClient(MONGODB_URI!, {
      // Connection limits (CRITICAL for Atlas free tier)
      maxPoolSize: 3,        // Very low to prevent hitting limits
      minPoolSize: 1,        // Keep one connection alive
      maxIdleTimeMS: 30000,  // Close idle connections quickly

      // Timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 15000,         // 15 seconds
      socketTimeoutMS: 45000,          // 45 seconds

      // Retry and SSL settings
      retryWrites: true,
      retryReads: true,
      ssl: true,

      // Compression and optimization
      compressors: ['snappy', 'zlib'],
      zlibCompressionLevel: 6,
    })

    cached.mongodb.promise = client.connect()
      .then(() => {
        console.log('✅ Connected to MongoDB (Native Client)')
        const db = client.db(MONGODB_DB)
        cached.mongodb.client = client
        cached.mongodb.db = db
        return { client, db }
      })
      .catch((error) => {
        console.error('❌ MongoDB native client connection error:', error.message)
        console.error('🔧 Connection URI:', MONGODB_URI!.replace(/:([^:@]{4})[^:@]*@/, ':***@'))
        console.error('💡 Troubleshooting:')
        console.error('   • Check MongoDB Atlas network access (allow 0.0.0.0/0)')
        console.error('   • Verify Atlas cluster is not paused')
        console.error('   • Check connection limits (free tier: ~500)')
        console.error('   • Wait a few minutes if recently hit limit')
        throw error
      })
  }

  try {
    const result = await cached.mongodb.promise
    console.log('✅ MongoDB client connection established successfully')
    return result
  } catch (e) {
    cached.mongodb.promise = null
    console.error('❌ Failed to establish MongoDB client connection:', e)
    throw e
  }
}

// =============================================================================
// CONNECTION HEALTH CHECK
// =============================================================================

export async function checkDatabaseHealth() {
  try {
    const { db } = await getMongoClient()
    await db.admin().ping()
    console.log('✅ Database health check passed')
    return true
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return false
  }
}

// =============================================================================
// CLEANUP (for development/testing)
// =============================================================================

export async function closeDatabaseConnections() {
  console.log('🧹 Closing database connections...')

  try {
    if (cached.mongodb.client) {
      await cached.mongodb.client.close()
      cached.mongodb.client = null
      cached.mongodb.db = null
      cached.mongodb.promise = null
      console.log('✅ MongoDB client connection closed')
    }

    if (cached.mongoose.conn) {
      await mongoose.disconnect()
      cached.mongoose.conn = null
      cached.mongoose.promise = null
      console.log('✅ Mongoose connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing database connections:', error)
  }
}
