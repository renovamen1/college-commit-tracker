const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Debug script to check database contents and sync status
async function debugDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found!')
    return
  }

  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected successfully\n')

    // Just use direct MongoDB native driver without models
    console.log('Using direct MongoDB queries for debugging')

    const db = mongoose.connection.db
    const departmentsCollection = db.collection('departments')
    const classesCollection = db.collection('classes')
    const studentsCollection = db.collection('students')  // Use students collection!
    const usersCollection = db.collection('users')        // Keep for reference

    // =====================================================
    // 1. CHECK DEPARTMENTS
    // =====================================================
    console.log('🏛️ CHECKING DEPARTMENTS:')
    const departments = await departmentsCollection.find({}).toArray()
    console.log(`Found ${departments.length} departments:`)
    departments.forEach(dept => {
      console.log(`  - ${dept.name} (${dept.code}) - ID: ${dept._id}`)
    })
    console.log('')

    // =====================================================
    // 2. CHECK CLASSES
    // =====================================================
    console.log('🎓 CHECKING CLASSES:')
    const classes = await classesCollection.find({}).toArray()
    console.log(`Found ${classes.length} classes:`)
    classes.forEach(cls => {
      console.log(`  - ${cls.name} (${cls.code}) - Dept: ${cls.departmentId} - ID: ${cls._id}`)
    })
    console.log('')

    // =====================================================
    // 3. CHECK STUDENTS - USE STUDENTS COLLECTION
    // =====================================================
    console.log('👥 CHECKING STUDENTS:')

    // Check both collections
    const studentsInUsers = await usersCollection.find({}).toArray()
    console.log(`Total documents in users collection: ${studentsInUsers.length}`)

    const studentsInStudents = await studentsCollection.find({}).toArray()
    console.log(`Total documents in students collection: ${studentsInStudents.length}`)

    // Use the students collection based on user feedback
    const students = studentsInStudents
    console.log(`Using students collection: Found ${students.length} students`)

    // Show sample of students found
    if (students.length > 0) {
      console.log('Sample students:')
      students.slice(0, 3).forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (@${student.githubUsername}) - Commits: ${student.totalCommits || 0}`)
      })
      console.log('')
    }

    let studentsWithCommits = 0
    let studentsWithoutCommits = 0

    // Show first 5 students only
    students.slice(0, 5).forEach(student => {
      const commitStatus = (student.totalCommits || 0) > 0 ? '✅' : '❌'
      if ((student.totalCommits || 0) > 0) studentsWithCommits++
      else studentsWithoutCommits++

      console.log(`  ${commitStatus} ${student.name} (@${student.githubUsername}) - Commits: ${student.totalCommits || 0} - Class: ${student.classId}`)
    })
    if (students.length > 5) {
      console.log(`  ... and ${students.length - 5} more students`)
    }
    console.log('')
    console.log(`📊 SUMMARY:`)
    console.log(`  Students with commits: ${studentsWithCommits}`)
    console.log(`  Students without commits: ${studentsWithoutCommits}`)
    console.log('')

    // =====================================================
    // 4. TEST SINGLE STUDENT SYNC
    // =====================================================
    if (students.length > 0) {
      console.log('🎯 TESTING SINGLE STUDENT SYNC:')
      const testStudent = students[0] // Test with first student
      console.log(`Testing sync for: ${testStudent.name} (@${testStudent.githubUsername})`)
      console.log(`Current commits: ${testStudent.totalCommits}`)

      // Test GitHub API directly
      try {
        const pathToGithub = require('path').resolve(__dirname, '../lib/github')
        const { getUserTotalCommitsFromEvents } = require(pathToGithub)
        const commitCount = await getUserTotalCommitsFromEvents(testStudent.githubUsername)
        console.log(`GitHub API returned: ${commitCount} commits`)

        // Test database update using native MongoDB driver - USE STUDENTS COLLECTION
        const updateResult = await studentsCollection.updateOne(
          { _id: testStudent._id },
          {
            $set: {
              totalCommits: commitCount,
              lastSyncDate: new Date()
            }
          }
        )

        if (updateResult.acknowledged && updateResult.modifiedCount > 0) {
          console.log(`✅ Database update successful!`)
          console.log(`Modified ${updateResult.modifiedCount} document(s)`)

          // Verify by reading back - USE STUDENTS COLLECTION
          const updated = await studentsCollection.findOne({ _id: testStudent._id })
          console.log(`Verified commits in database: ${updated?.totalCommits || 'null'}`)
        } else {
          console.log(`❌ Database update failed!`, updateResult)
        }

      } catch (error) {
        console.log(`❌ Sync test failed:`, error.message)
      }
      console.log('')
    }

    // =====================================================
    // 5. NO STUDENTS TO TEST SYNCS
    // =====================================================

    if (students.length === 0) {
      console.log('❌ CRITICAL: No students found in database!')
      console.log('This explains why the dashboard shows no data.')
      console.log('Check if students were properly seeded into MongoDB Atlas.')
      console.log('')

      // Show collection stats
      const collections = await db.listCollections().toArray()
      console.log('📊 AVAILABLE COLLECTIONS:')
      collections.forEach(col => {
        console.log(`  - ${col.name}`)
      })

      console.log('')
      console.log('💡 SOLUTION: Run the seed script to populate students.')
    } else {
      console.log('� TESTING SINGLE STUDENT SYNC:')
      console.log('Text will go here')
    }

  } catch (error) {
    console.error('❌ Debug script failed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Connection closed')
  }
}

// Run debug script
debugDatabase()
  .then(() => {
    console.log('\n🎉 Debug script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Debug script failed:', error)
    process.exit(1)
  })
