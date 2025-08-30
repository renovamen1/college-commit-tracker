const { connectToDatabase } = require('./src/lib/database.js')

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const conn = await connectToDatabase()
    console.log('✅ Database connected successfully!')

    // Test Mongoose connection
    const db = conn.connection
    console.log(`Connected to database: ${db.name}`)
    console.log(`Database host: ${db.host}`)
    console.log(`Database port: ${db.port}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

testConnection()
