'use client'

import { useState, useEffect, Suspense } from 'react'
import { Trophy, Award, Medal, Calendar, Users, Filter, TrendingUp, User } from 'lucide-react'

// Components
import StudentRank from '@/components/leaderboard/StudentRank'
import ClassRank from '@/components/leaderboard/ClassRank'

// Types for leaderboard data
interface Student {
  id: string
  githubUsername: string
  name: string | null
  totalCommits: number
  rank: number
  className?: string
  department?: string
  lastSyncDate: string
}

interface ClassData {
  id: string
  name: string
  department: string
  avgCommits: number
  totalStudents: number
  rank: number
  topStudent: Student
}

type TimePeriod = 'all-time' | 'month' | 'week'

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function LeaderboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-80 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Top 3 Podium Skeleton */}
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 0, 2].map((i) => (
            <div key={i} className="h-56 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock data generator for demonstration
function generateMockLeaderboard(): {
  students: Student[]
  classes: ClassData[]
  departments: string[]
  classNames: string[]
} {
  const mockStudents: Student[] = [
    {
      id: '1',
      githubUsername: 'johndoe',
      name: 'John Doe',
      totalCommits: 1245,
      rank: 1,
      className: 'CS101',
      department: 'Computer Science',
      lastSyncDate: '2025-01-15'
    },
    {
      id: '2',
      githubUsername: 'alicesmith',
      name: 'Alice Smith',
      totalCommits: 1123,
      rank: 2,
      className: 'CS102',
      department: 'Computer Science',
      lastSyncDate: '2025-01-15'
    },
    {
      id: '3',
      githubUsername: 'bobjohnson',
      name: 'Bob Johnson',
      totalCommits: 987,
      rank: 3,
      className: 'IT101',
      department: 'Information Technology',
      lastSyncDate: '2025-01-15'
    }
  ]

  // Generate more students
  for (let i = 4; i <= 20; i++) {
    mockStudents.push({
      id: i.toString(),
      githubUsername: `student${i}`,
      name: `Student ${i}`,
      totalCommits: Math.floor(Math.random() * 800 + 200),
      rank: i,
      className: `Class${Math.floor(Math.random() * 3) + 1}`,
      department: ['Computer Science', 'Information Technology', 'Mathematics'][Math.floor(Math.random() * 3)],
      lastSyncDate: '2025-01-15'
    })
  }

  // Sort students by commits for ranking
  mockStudents.sort((a, b) => b.totalCommits - a.totalCommits)
  mockStudents.forEach((student, index) => {
    student.rank = index + 1
  })

  const mockClasses: ClassData[] = [
    {
      id: '1',
      name: 'CS101',
      department: 'Computer Science',
      avgCommits: 742,
      totalStudents: 25,
      rank: 1,
      topStudent: mockStudents[0]
    },
    {
      id: '2',
      name: 'CS102',
      department: 'Computer Science',
      avgCommits: 687,
      totalStudents: 22,
      rank: 2,
      topStudent: mockStudents[1]
    },
    {
      id: '3',
      name: 'IT101',
      department: 'Information Technology',
      avgCommits: 654,
      totalStudents: 18,
      rank: 3,
      topStudent: mockStudents[2]
    }
  ]

  return {
    students: mockStudents.slice(0, 10),
    classes: mockClasses,
    departments: Array.from(new Set(mockStudents.map(s => s.department!).filter(Boolean))),
    classNames: Array.from(new Set(mockStudents.map(s => s.className!).filter(Boolean)))
  }
}

export default function LeaderboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<ClassData[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [classNames, setClassNames] = useState<string[]>([])
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all-time')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading leaderboard data
    setTimeout(() => {
      const data = generateMockLeaderboard()
      setStudents(data.students)
      setClasses(data.classes)
      setDepartments(data.departments)
      setClassNames(data.classNames)
      setLoading(false)
    }, 1000)
  }, [timePeriod, selectedDepartment, selectedClass])

  // Filter students based on department and class
  const filteredStudents = students.filter(student => {
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment
    const matchesClass = selectedClass === 'all' || student.className === selectedClass
    return matchesDepartment && matchesClass
  })

  if (loading) {
    return <LeaderboardSkeleton />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
          Leaderboard Championship
        </h1>

        {/* Time Period Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: 'all-time', label: 'All Time', icon: Calendar },
              { value: 'month', label: 'This Month', icon: Calendar },
              { value: 'week', label: 'This Week', icon: Calendar }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTimePeriod(value as TimePeriod)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timePeriod === value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filters:</span>
        </div>

        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Class Filter */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Classes</option>
          {classNames.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
      </div>

      {/* TOP PERFORMERS SECTION */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Top 10 Performers
        </h2>

        {/* Top 3 Podium */}
        {filteredStudents.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 2nd Place */}
            <div className="md:order-1 md:col-span-1 transform -translate-y-4">
              <StudentRank
                student={filteredStudents[1]}
                rank={filteredStudents[1].rank}
                totalCommits={filteredStudents[1].totalCommits}
                isPodium
                podiumPosition="second"
              />
            </div>

            {/* 1st Place - Winner */}
            <div className="md:order-2 md:col-span-1 transform -translate-y-8">
              <StudentRank
                student={filteredStudents[0]}
                rank={filteredStudents[0].rank}
                totalCommits={filteredStudents[0].totalCommits}
                isPodium
                podiumPosition="first"
              />
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 md:col-span-1 transform -translate-y-2">
              <StudentRank
                student={filteredStudents[2]}
                rank={filteredStudents[2].rank}
                totalCommits={filteredStudents[2].totalCommits}
                isPodium
                podiumPosition="third"
              />
            </div>
          </div>
        )}

        {/* Rest of Top 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.slice(3, 10).map(student => (
            <StudentRank
              key={student.id}
              student={student}
              rank={student.rank}
              totalCommits={student.totalCommits}
            />
          ))}
        </div>
      </div>

      {/* CLASS RANKINGS */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <User className="h-6 w-6 mr-2" />
          Class Rankings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map(classData => (
            <ClassRank key={classData.id} classData={classData} />
          ))}
        </div>
      </div>

      {/* Competition Stats Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Competition Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{classes.length}</div>
            <div className="text-sm text-gray-600">Active Classes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(students.reduce((sum, s) => sum + s.totalCommits, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Commits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {students.length > 0
                ? formatNumber(Math.round(students.reduce((sum, s) => sum + s.totalCommits, 0) / students.length))
                : '0'
              }
            </div>
            <div className="text-sm text-gray-600">Average Commits</div>
          </div>
        </div>
      </div>
    </div>
  )
}
