'use client'

import { useState, useEffect, Suspense } from 'react'
import { ActivityListSkeleton } from './LoadingSkeleton'
import { User, GitBranch, Calendar, TrendingUp, Users } from 'lucide-react'

interface ActivityUser {
  id: string
  githubUsername: string
  name: string
  email: string
  totalCommits: number
  lastSyncDate: Date | null
  createdAt: Date
  className: string | null
}

async function fetchRecentUsers(): Promise<ActivityUser[]> {
  const res = await fetch('/api/admin/users?limit=10&recent=true', {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch recent users')
  const data = await res.json()
  return data.users
}

async function fetchHighCommitUsers(): Promise<ActivityUser[]> {
  const res = await fetch('/api/admin/users?limit=10&highCommits=true', {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch high commit users')
  const data = await res.json()
  return data.users
}

function UserCard({ user }: { user: ActivityUser }) {
  const displayName = user.name || user.githubUsername
  const timeAgo = new Date(user.createdAt).toLocaleDateString()

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {user.githubUsername.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <GitBranch className="h-3 w-3 mr-1" />
            {user.totalCommits}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          <span>@{user.githubUsername}</span>
          {user.className && <span>• {user.className}</span>}
          <span>• {timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

export default function RecentActivity() {
  const [recentUsers, setRecentUsers] = useState<ActivityUser[]>([])
  const [highCommitUsers, setHighCommitUsers] = useState<ActivityUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'recent' | 'commits'>('recent')
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [recent, highCommits] = await Promise.all([
          fetchRecentUsers(),
          fetchHighCommitUsers()
        ])
        // Ensure arrays are initialized even if API returns null/undefined
        setRecentUsers(Array.isArray(recent) ? recent : [])
        setHighCommitUsers(Array.isArray(highCommits) ? highCommits : [])
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set initial time on client side only to prevent hydration mismatch
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  const tabs = [
    { id: 'recent', label: 'Recent Students', icon: User },
    { id: 'commits', label: 'Top Contributors', icon: TrendingUp }
  ]

  const currentUsers = activeTab === 'recent' ? recentUsers : highCommitUsers
  const emptyMessage = activeTab === 'recent' ? 'No students added yet' : 'No contributors found'

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Activity
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Recent Activity
        </h2>
        {loading && (
          <div className="text-sm text-gray-500">Refreshing...</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'recent' | 'commits')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <ActivityListSkeleton />
      ) : currentUsers.length > 0 ? (
        <div className="space-y-2">
          {currentUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Auto-refreshes every 60 seconds • Last updated {lastUpdated || 'Loading...'}
        </div>
      </div>
    </div>
  )
}
