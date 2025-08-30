import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testDbConnection() {
  try {
    console.log('Testing MongoDB connection...');

    // Use the same connection string from .env.local
    const uri = process.env.MONGODB_URI;
    console.log('Connection URI:', uri);

    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return;
    }

    // Try to connect with explicit options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log('✅ Successfully connected to MongoDB');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);

    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));

    // Close connection
    await mongoose.connection.close();
    console.log('🔐 Connection closed');

  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.name === 'MongosNetworkError') {
      console.error('💡 This usually means:');
      console.error('   - Your IP address is not whitelisted in MongoDB Atlas');
      console.error('   - Or your connection string is incorrect');
      console.error('   - Or there is a firewall blocking the connection');
    } else if (error.name === 'MongoServerError') {
      console.error('💡 This usually means:');
      console.error('   - Authentication failed (wrong username/password)');
      console.error('   - Database name is incorrect');
    } else if (error.codeName === 'AuthenticationFailed') {
      console.error('💡 Authentication failed - check your username and password');
    }

    console.error('\n🔍 Full error details:', error);
  }
}

testDbConnection();
