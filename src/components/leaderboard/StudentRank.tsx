'use client'

import { useState, useEffect } from 'react'
import { Trophy, Award, Medal } from 'lucide-react'

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

interface StudentRankProps {
  student: Student
  rank: number
  totalCommits: number
  isPodium?: boolean
  podiumPosition?: 'first' | 'second' | 'third'
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function getRankIcon(rank: number, isPodium = false) {
  if (isPodium) {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return null
    }
  }

  return <span className="text-lg font-bold text-gray-600">{rank}</span>
}

export default function StudentRank({
  student,
  rank,
  totalCommits,
  isPodium = false,
  podiumPosition
}: StudentRankProps) {
  const [animatedCommits, setAnimatedCommits] = useState(0)

  // Animate number counter
  useEffect(() => {
    if (isPodium) {
      const duration = 1000 // 1 second animation
      const increment = totalCommits / (duration / 16) // Animate 60fps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= totalCommits) {
          setAnimatedCommits(totalCommits)
          clearInterval(timer)
        } else {
          setAnimatedCommits(Math.floor(current))
        }
      }, 16)

      return () => clearInterval(timer)
    } else {
      setAnimatedCommits(totalCommits)
    }
  }, [isPodium, totalCommits])

  const displayName = student.name || student.githubUsername

  const podiumGradients = {
    first: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600',
    second: 'bg-gradient-to-br from-gray-400 via-gray-500 to-slate-600',
    third: 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600'
  }

  const podiumBg = isPodium && podiumPosition ? podiumGradients[podiumPosition] : 'bg-white'

  return (
    <div className={`
      ${podiumBg}
      rounded-xl shadow-sm border border-gray-200 p-6
      ${isPodium ? 'text-white' : ''}
      ${isPodium ? 'hover:scale-105' : 'hover:shadow-md'}
      transition-all duration-200
    `}>
      {/* Medal/Icon */}
      <div className="flex justify-center mb-4">
        {getRankIcon(rank, isPodium)}
      </div>

      {/* Avatar */}
      <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${
        isPodium
          ? 'bg-white bg-opacity-20 text-white'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      }`}>
        {student.githubUsername.charAt(0).toUpperCase()}
      </div>

      {/* Name and Username */}
      <div className="text-center mb-3">
        <h3 className={`text-lg font-semibold ${
          isPodium ? 'text-white' : 'text-gray-900'
        }`}>
          {displayName}
        </h3>
        <p className={`text-sm ${
          isPodium ? 'text-white text-opacity-80' : 'text-gray-600'
        }`}>
          @{student.githubUsername}
        </p>
        {student.className && (
          <p className={`text-xs ${
            isPodium ? 'text-white text-opacity-70' : 'text-gray-500'
          } mt-1`}>
            {student.className}
          </p>
        )}
      </div>

      {/* Commit Count */}
      <div className="text-center mb-4">
        <div className={`text-2xl font-bold ${
          isPodium ? 'text-white' : 'text-gray-900'
        }`}>
          {isPodium ? formatNumber(animatedCommits) : formatNumber(totalCommits)}
        </div>
        <div className={`text-xs ${
          isPodium ? 'text-white text-opacity-70' : 'text-gray-500'
        }`}>
          commits
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isPodium ? 'bg-white' : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            style={{ width: `${Math.min((totalCommits / 1000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Last Sync */}
      <div className={`text-xs text-center ${
        isPodium ? 'text-white text-opacity-70' : 'text-gray-500'
      }`}>
        Last sync: {new Date(student.lastSyncDate).toLocaleDateString()}
      </div>
    </div>
  )
}
