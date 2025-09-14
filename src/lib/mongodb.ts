import { MongoClient, MongoClientOptions } from 'mongodb'
import config from './config'

const uri = config.mongodb.uri

// Enhanced connection options with connection pooling
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  minPoolSize: 5, // Maintain minimum 5 connections in pool
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (config.app.nodeEnv === 'development') {
  // In development mode, use a global variable
  // so that the value is preserved across module reloads
  // caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message)
        throw error
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message)
      throw error
    })
}

// Export database name for consistency
export const DATABASE_NAME = 'college-commit-tracker'

export default clientPromise
