'use client'

import { useState } from 'react'
import { Medal, Users, TrendingUp, Award } from 'lucide-react'

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

interface ClassRankProps {
  classData: ClassData
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Medal className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Award className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-gray-600">#{rank}</span>
  }
}

export default function ClassRank({ classData }: ClassRankProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const averageCommits = Math.round(classData.avgCommits)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {getRankIcon(classData.rank)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{classData.name}</h3>
            <p className="text-sm text-gray-600">{classData.department}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">{formatNumber(averageCommits)}</div>
          <div className="text-xs text-gray-500">avg commits</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">{classData.totalStudents} students</span>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            Top: @{classData.topStudent.githubUsername}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Average Progress</span>
          <span className="text-xs font-medium text-gray-900">
            {formatNumber(averageCommits)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((averageCommits / 1000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Expandable Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Hide Details' : 'Show Top 3 Students'}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Mock top 3 students for this class */}
            {[
              { ...classData.topStudent, rank: 1 },
              {
                id: '2',
                githubUsername: `student${Math.floor(Math.random() * 10) + 1}`,
                name: `Student ${Math.floor(Math.random() * 10) + 1}`,
                totalCommits: Math.floor(averageCommits * (0.8 + Math.random() * 0.4)),
                rank: 2
              },
              {
                id: '3',
                githubUsername: `student${Math.floor(Math.random() * 20) + 2}`,
                name: `Student ${Math.floor(Math.random() * 20) + 2}`,
                totalCommits: Math.floor(averageCommits * (0.6 + Math.random() * 0.3)),
                rank: 3
              }
            ].map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {student.githubUsername.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.name || student.githubUsername}
                    </p>
                    <p className="text-xs text-gray-600">@{student.githubUsername}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatNumber(student.totalCommits)}</p>
                  <p className="text-xs text-gray-500">commits</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
