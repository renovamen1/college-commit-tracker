'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface DashboardData {
  personal: {
    totalCommits: number
    currentStreak: number
    githubUsername: string
    name?: string
    lastSyncDate: Date | null
    activeSince: Date
    rank: string
  }
  repositories: Array<{
    name: string
    language: string
    commits: number
    lastUpdate: string
  }>
  contributionCalendar: Array<{
    date: string
    commits: number
  }>
  classStanding: {
    className: string
    position: number
    totalStudents: number
    averageCommits: number
    yourCommits: number
    topStudents: Array<{
      name: string
      commits: number
      position: number
    }>
  }
  collegeStats: {
    totalStudents: number
    totalCommits: number
    averageCommits: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.data) {
        setDashboardData(result.data)
      } else {
        throw new Error(result.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSync = async () => {
    if (!dashboardData?.personal.githubUsername) return

    try {
      setSyncing(true)
      console.log('🔄 Starting GitHub sync for', dashboardData.personal.githubUsername)

      const response = await fetch(`/api/sync/student/${encodeURIComponent(dashboardData.personal.githubUsername)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('🔄 Sync response status:', response.status)

      if (response.ok) {
        const syncResult = await response.json()
        console.log('✅ Sync result:', syncResult)

          if (syncResult.success) {
            // Immediately update UI with new data
            console.log('🔄 Updating dashboard with:', syncResult.user)
            setDashboardData(prev => ({
              ...prev!,
              personal: {
                ...prev!.personal,
                totalCommits: syncResult.user.newCommits,
                lastSyncDate: new Date(syncResult.user.lastSyncDate),
                currentStreak: Math.min(syncResult.user.newCommits, prev!.personal.currentStreak + 2) // Mock streak update
              },
              repositories: prev!.repositories.length > 0 ? prev!.repositories.map(repo => ({
                ...repo,
                lastUpdate: 'Updated with sync' // Mark as updated
              })) : prev!.repositories
            }))

            // Clear any existing errors
            setError(null)

            console.log('🎉 Sync completed! Total commits now:', syncResult.user.newCommits)
          } else {
          console.error('❌ Sync failed on backend:', syncResult.error)
          setError(`Sync failed: ${syncResult.error}`)
        }
      } else if (response.status === 404) {
        console.error('❌ GitHub user not found')
        setError('GitHub user not found. Check username spelling.')
      } else {
        console.error('❌ Sync request failed:', response.status)
        setError('Sync request failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Manual sync error:', error)
      setError('Network error. Check your connection and try again.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    // Redirect to home (which will show landing page)
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter min-w-72">Dashboard</h1>
        <p className="text-white/60 mt-2">Your personal GitHub activity overview.</p>
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Personal Details Section */}
          <section>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Personal Details</h2>
            <div className="mt-4 p-6 rounded-md bg-[#192633] border border-[#324d67]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-white/60 text-base font-medium leading-normal">Name</p>
                  <p className="text-white tracking-light text-xl font-semibold leading-tight">
                    {dashboardData?.personal.name || 'Not provided'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-white/60 text-base font-medium leading-normal">GitHub Username</p>
                  <p className="text-white tracking-light text-xl font-semibold leading-tight">
                    @{dashboardData?.personal.githubUsername || 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* College Ranking Section */}
          <section className="mt-8">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">College Ranking</h2>
            <div className="mt-4 p-6 rounded-md bg-[#192633] border border-[#324d67]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-white/60 text-base font-medium leading-normal">Overall College Rank</p>
                  <p className="text-white tracking-light text-3xl font-bold leading-tight">
                    {dashboardData?.personal.rank || '#N/A'}
                  </p>
                  <p className="text-white/80 text-sm">
                    Out of {dashboardData?.collegeStats?.totalStudents || 0} students
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl mb-2">
                    {dashboardData?.personal.rank === '#1' && '🥇'}
                    {dashboardData?.personal.rank === '#2' && '🥈'}
                    {dashboardData?.personal.rank === '#3' && '🥉'}
                    {parseInt(dashboardData?.personal.rank?.replace('#', '') || '0') > 3 && '🏆'}
                  </div>
                  <p className="text-white/60 text-sm">College Wide</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contributions Section */}
          <section className="mt-8">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Contributions</h2>
            <div className="mt-4 p-6 rounded-md bg-[#192633] border border-[#324d67]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-white/60 text-base font-medium leading-normal">Total Contributions</p>
                    <p className="text-white tracking-light text-3xl font-bold leading-tight">
                      {loading ? '...' : dashboardData?.personal.totalCommits || 0}
                    </p>
                  </div>
                  {dashboardData && (
                    <button
                      onClick={handleManualSync}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 h-fit"
                      disabled={syncing}
                    >
                      {syncing ? '💫 Syncing...' : '🔄 Sync GitHub Data'}
                    </button>
                  )}
                </div>

                <div className="mt-2 p-3 rounded-md bg-[#111a22] border border-[#324d67]/50">
                  <p className="text-white/80 text-sm leading-relaxed">
                    <span className="font-medium">Note:</span> Total contributions represents commits from public repositories only.
                    To include private repository contributions, enable the setting in your GitHub account privacy options.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Section */}
          <section className="mt-8">
            <h3 className="text-white text-lg font-semibold mb-3">Settings</h3>
            <div className="flex flex-col gap-3">

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 bg-[#192633] hover:bg-red-900/20 border border-[#233648] rounded-lg p-4 transition-colors w-full text-left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          {/* Class Leaderboard */}
          <section>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Class Leaderboard</h2>
            {dashboardData && (
              <div className="mt-4 rounded-md border border-[#324d67] bg-[#192633]">
                <div className="p-4 border-b border-[#324d67]">
                  <p className="text-white font-semibold">{dashboardData.classStanding.className}</p>
                  <p className="text-sm text-white/60">Your rank: <span className="text-white font-bold">#{dashboardData.classStanding.position}</span></p>
                </div>
                <ul className="divide-y divide-[#324d67]">
                  {dashboardData.classStanding.topStudents.slice(0, 3).map((student, index) => (
                    <li key={index} className={`p-4 flex items-center justify-between ${student.position === dashboardData.classStanding.position ? 'bg-[#111a22]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-white/80 font-semibold">{student.position}.</span>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 bg-gradient-to-r from-blue-500 to-purple-500">
                          <span className="text-white text-xs font-semibold uppercase">{student.name.charAt(0)}</span>
                        </div>
                        <p className="text-white text-sm font-medium">
                          {student.position === dashboardData.classStanding.position ? 'You' : student.name}
                        </p>
                      </div>
                      <p className="text-sm text-[#92adc9]">{student.commits} commits</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) || (
              <div className="mt-4 rounded-md border border-[#324d67] bg-[#192633] p-8 text-center">
                <p className="text-white/60 text-sm">Loading leaderboard...</p>
              </div>
            )}
          </section>

          {/* Your Repositories */}
          <section className="mt-8">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Your Repositories</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="text-white/60 text-sm">Loading repositories...</div>
              ) : dashboardData?.repositories && dashboardData.repositories.length > 0 ? (
                dashboardData.repositories.map((repo, index) => (
                  <a
                    key={index}
                    className="block p-4 rounded-md bg-[#192633] border border-[#324d67] hover:border-[#1172d4] transition-colors"
                    href={`https://github.com/${dashboardData.personal.githubUsername}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-white font-semibold">{repo.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-white/60">{repo.lastUpdate}</p>
                      {repo.language && (
                        <span className="text-xs bg-[#1172d4]/20 text-[#1172d4] px-2 py-1 rounded">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    {repo.commits && (
                      <p className="text-xs text-white/60 mt-1">{repo.commits} commits</p>
                    )}
                  </a>
                ))
              ) : (
                <>
                  <div className="text-white/60 text-sm">No repositories found</div>
                  <a className="block p-4 rounded-md bg-[#192633] border border-[#324d67] hover:border-[#1172d4] transition-colors" href="#">
                    <p className="text-white font-semibold">Sample Repository</p>
                    <p className="text-sm text-white/60">Placeholder repository</p>
                  </a>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

<style jsx>{`
      .tooltip {
        position: relative;
        display: inline-block;
      }
      .tooltip .tooltip-text {
        visibility: hidden;
        width: 100px;
        background-color: #0b1218;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -50px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
      }
    `}</style>
    </div>
  )
}
