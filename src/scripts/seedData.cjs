// src/scripts/seedData.js
const mongoose = require('mongoose')
const { connectToDatabase } = require('../lib/database')
const User = require('../lib/models/User')
const Class = require('../lib/models/Class')

const sampleData = {
  classes: [
    { name: 'CS101', department: 'Computer Science' },
    { name: 'CS102', department: 'Computer Science' },
    { name: 'IT101', department: 'Information Technology' },
    { name: 'DS201', department: 'Data Science' },
    { name: 'MATH101', department: 'Mathematics' },
    { name: 'ENG201', department: 'Engineering' }
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
    
    // Top performers (CS101)
    {
      githubUsername: 'sarahchen',
      name: 'Sarah Chen',
      email: 'sarah.chen@college.edu',
      role: 'student',
      totalCommits: 1245,
      lastSyncDate: new Date('2025-01-15')
    },
    {
      githubUsername: 'alex.rodriguez',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@college.edu', 
      role: 'student',
      totalCommits: 1178,
      lastSyncDate: new Date('2025-01-14')
    },
    {
      githubUsername: 'mia.patel',
      name: 'Mia Patel',
      email: 'mia.patel@college.edu',
      role: 'student',
      totalCommits: 1123,
      lastSyncDate: new Date('2025-01-13')
    },
    
    // High performers (CS102)
    {
      githubUsername: 'james.wilson',
      name: 'James Wilson',
      email: 'james.wilson@college.edu',
      role: 'student',
      totalCommits: 987,
      lastSyncDate: new Date('2025-01-15')
    },
    {
      githubUsername: 'emma.davis',
      name: 'Emma Davis',
      email: 'emma.davis@college.edu',
      role: 'student',
      totalCommits: 954,
      lastSyncDate: new Date('2025-01-14')
    },
    
    // Mid-tier performers (IT101)
    {
      githubUsername: 'liam.thompson',
      name: 'Liam Thompson',
      email: 'liam.thompson@college.edu',
      role: 'student',
      totalCommits: 821,
      lastSyncDate: new Date('2025-01-13')
    },
    {
      githubUsername: 'olivia.johnson',
      name: 'Olivia Johnson',
      email: 'olivia.johnson@college.edu',
      role: 'student',
      totalCommits: 788,
      lastSyncDate: new Date('2025-01-12')
    },
    
    // Additional students
    {
      githubUsername: 'noah.brown',
      name: 'Noah Brown',
      email: 'noah.brown@college.edu',
      role: 'student',
      totalCommits: 654,
      lastSyncDate: new Date('2025-01-11')
    },
    {
      githubUsername: 'ava.miller',
      name: 'Ava Miller',
      email: 'ava.miller@college.edu',
      role: 'student',
      totalCommits: 623,
      lastSyncDate: new Date('2025-01-10')
    },
    {
      githubUsername: 'ethan.garcia',
      name: 'Ethan Garcia',
      email: 'ethan.garcia@college.edu',
      role: 'student',
      totalCommits: 598,
      lastSyncDate: new Date('2025-01-09')
    }
  ]
}

async function seedDatabase() {
  try {
    await connectToDatabase()
    console.log('Connected to MongoDB Atlas')
    
    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Class.deleteMany({})
    
    // Create classes
    console.log('Creating classes...')
    const createdClasses = await Class.insertMany(sampleData.classes.map(cls => ({
      name: cls.name,
      department: cls.department,
      studentCount: 0,
      totalCommits: 0
    })))
    console.log(`Created ${createdClasses.length} classes`)
    
    // Create map of class IDs
    const classMap = {}
    createdClasses.forEach(cls => {
      classMap[cls.name] = cls._id
    })
    
    // Assign classes to students and create users
    console.log('Creating users...')
    const usersToCreate = sampleData.users.map(student => ({
      githubUsername: student.githubUsername,
      name: student.name,
      email: student.email,
      role: student.role,
      totalCommits: student.totalCommits || 0,
      lastSyncDate: student.lastSyncDate,
      classId: student === sampleData.users[0] ? undefined : // admin has no class
              Math.random() > 0.3 ? classMap['CS101'] : // 70% in CS101
              Math.random() > 0.5 ? classMap['CS102'] :
              Math.random() > 0.5 ? classMap['IT101'] :
              Math.random() > 0.5 ? classMap['DS201'] :
              Math.random() > 0.5 ? classMap['MATH101'] : classMap['ENG201']
    }))
    
    const createdUsers = await User.insertMany(usersToCreate)
    console.log(`Created ${createdUsers.length} users`)
    
    // Update class statistics
    console.log('Updating class statistics...')
    for (const class_doc of createdClasses) {
      const classStudents = createdUsers.filter(user => 
        user.classId && user.classId.toString() === class_doc._id.toString()
      )
      
      class_doc.studentCount = classStudents.length
      class_doc.totalCommits = classStudents.reduce((sum, student) => 
        sum + student.totalCommits, 0
      )
      
      await class_doc.save()
    }
    
    console.log('Sample data seeding completed successfully!')
    console.log('Summary:')
    console.log(`- ${createdClasses.length} classes created`)
    console.log(`- ${createdUsers.length} users created (${createdUsers.filter(u => u.role === 'student').length} students)`)
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    mongoose.connection.close()
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
