import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables FIRST
config({ path: '.env.local' });

// Now import our modules that depend on environment variables
import { connectToDatabase } from './src/lib/database.js';
import User from './src/lib/models/User.js';
import Class from './src/lib/models/Class.js';

const sampleData = {
  classes: [
    { name: 'CS101', department: 'Computer Science' },
    { name: 'CS102', department: 'Computer Science' },
    { name: 'IT101', department: 'Information Technology' },
    { name: 'DS201', department: 'Data Science' },
  ],

  users: [
    // Admin users
    {
      githubUsername: 'admin',
      name: 'System Administrator',
      email: 'admin@college.edu',
      role: 'admin',
      totalCommits: 0
    },

    // Sample students
    {
      githubUsername: 'johndoe',
      name: 'John Doe',
      email: 'john.doe@college.edu',
      role: 'student',
      totalCommits: 256,
      lastSyncDate: new Date('2025-01-15')
    },
    {
      githubUsername: 'janedoe',
      name: 'Jane Doe',
      email: 'jane.doe@college.edu',
      role: 'student',
      totalCommits: 189,
      lastSyncDate: new Date('2025-01-14')
    }
  ]
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectToDatabase();
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({})
    await Class.deleteMany({})

    // Create classes
    console.log('🏫 Creating classes...');
    const createdClasses = await Class.insertMany(sampleData.classes.map(cls => ({
      name: cls.name,
      department: cls.department,
      studentCount: 0,
      totalCommits: 0
    })))
    console.log(`✅ Created ${createdClasses.length} classes`)

    // Assign students to classes and create users
    console.log('👥 Creating users...');
    const usersToCreate = sampleData.users.map(student => ({
      githubUsername: student.githubUsername,
      name: student.name,
      email: student.email,
      role: student.role,
      totalCommits: student.totalCommits || 0,
      lastSyncDate: student.lastSyncDate,
      classId: student === sampleData.users[0] ? undefined
              : createdClasses[Math.floor(Math.random() * createdClasses.length)]._id
    }))

    const createdUsers = await User.insertMany(usersToCreate)
    console.log(`✅ Created ${createdUsers.length} users (${createdUsers.filter(u => u.role === 'student').length} students)`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('✨ Summary:')
    console.log(`   - ${createdClasses.length} classes`)
    console.log(`   - ${createdUsers.length} total users`)
    console.log(`   - ${createdUsers.filter(u => u.role === 'student').length} students`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('🔐 Database connection closed')
  }
}

seedDatabase();
