'use client'

import { useState, useEffect } from 'react'

interface DepartmentRanking {
  name: string
  departmentId: string
  totalCommits: number
  activeStudents: number
  syncedStudents: number
  averageCommits: number
}

interface ClassRanking {
  name: string
  code: string
  classId: string
  academicYear: string
  semester: string
  totalCommits: number
  studentCount: number
  averageCommits: number
}

interface TopContributor {
  name: string
  githubUsername: string
  totalCommits: number
  lastSyncDate: Date | null
  className: string
  classCode: string
  academicYear: string
}

interface DashboardData {
  overview: {
    totalCommits: number
    totalContributors: number
    activeRepositories: number
    syncRate: number
    averageCommits: number
  }
  departmentRankings: DepartmentRanking[]
  classRankings: ClassRanking[]
  topContributors: TopContributor[]
  activityMetrics: {
    lastSyncTime: Date | null
    activeSyncedStudents: number
    hoursSinceLastSync: number | null
    averageSyncAgeHours: number
  }
  metadata: {
    generatedAt: Date
    version: string
    dataSource: string
  }
}

export default function HomeDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/dashboard', {
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
      // Fallback to mock data on error
      setDashboardData(getMockDashboardData())
    } finally {
      setLoading(false)
    }
  }

  const handleSyncAll = async () => {
    if (!dashboardData) return

    try {
      setSyncing(true)
      console.log('🔄 Starting college-wide sync...')

      const response = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const syncResult = await response.json()
        console.log('✅ Sync completed:', syncResult)

        // Refresh dashboard data after sync
        await fetchDashboardData()

        console.log('🎉 Dashboard refreshed with latest GitHub data!')
      } else {
        console.error('❌ Sync request failed:', response.status)
        setError('Sync request failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Sync error:', error)
      setError('Network error. Check your connection and try again.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Mock data fallback for development/error states
  const getMockDashboardData = (): DashboardData => ({
    overview: {
      totalCommits: 24589,
      totalContributors: 832,
      activeRepositories: 128,
      syncRate: 87,
      averageCommits: 195
    },
    departmentRankings: [
      { name: "Computer Science", departmentId: "cs", totalCommits: 15430, activeStudents: 85, syncedStudents: 72, averageCommits: 205 },
      { name: "Electrical Engineering", departmentId: "ee", totalCommits: 5210, activeStudents: 45, syncedStudents: 38, averageCommits: 116 },
      { name: "Mathematics", departmentId: "math", totalCommits: 2890, activeStudents: 32, syncedStudents: 28, averageCommits: 90 }
    ],
    classRankings: [
      { name: "CS101 - Introduction to Programming", code: "CS101", classId: "cs101", academicYear: "2024", semester: "Fall", totalCommits: 1250, studentCount: 45, averageCommits: 28 },
      { name: "Data Structures", code: "CS201", classId: "cs201", academicYear: "2024", semester: "Spring", totalCommits: 1100, studentCount: 38, averageCommits: 29 },
      { name: "Algorithms", code: "CS301", classId: "cs301", academicYear: "2024", semester: "Fall", totalCommits: 980, studentCount: 35, averageCommits: 28 }
    ],
    topContributors: [
      { name: "Ethan Harper", githubUsername: "ethanharper", totalCommits: 312, lastSyncDate: new Date(), className: "Computer Science", classCode: "CS101", academicYear: "2024" },
      { name: "Olivia Bennett", githubUsername: "oliviab", totalCommits: 298, lastSyncDate: new Date(), className: "Computer Science", classCode: "CS201", academicYear: "2024" },
      { name: "Noah Carter", githubUsername: "noahcarter", totalCommits: 255, lastSyncDate: new Date(), className: "Electrical Engineering", classCode: "EE201", academicYear: "2024" },
      { name: "Ava Mitchell", githubUsername: "avamitchell", totalCommits: 241, lastSyncDate: new Date(), className: "Mathematics", classCode: "MATH301", academicYear: "2024" }
    ],
    activityMetrics: {
      lastSyncTime: new Date(),
      activeSyncedStudents: 118,
      hoursSinceLastSync: 2,
      averageSyncAgeHours: 4
    },
    metadata: {
      generatedAt: new Date(),
      version: "1.0.0",
      dataSource: "Mock Data"
    }
  })

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Dashboard</h1>
        <p className="text-white/60 mt-2">
          A high-level overview of the college's GitHub activity.
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {dashboardData && (
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleSyncAll}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              disabled={syncing}
            >
              {syncing ? '🔄 Syncing All Students...' : '🔄 Sync All GitHub Data'}
            </button>
            <span className="text-white/60 text-xs">
              Last updated: {new Date(dashboardData.metadata.generatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </header>

      {/* Dashboard Content Grid */}
      <section className="grid grid-cols-1 gap-8">
        {/* Main Content - Full Width */}
        <div>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">
                {loading ? '...' : dashboardData?.overview.totalCommits.toLocaleString() || '24,589'}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <p className="text-white/60 text-base font-medium leading-normal">Total Contributors</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">
                {loading ? '...' : dashboardData?.overview.totalContributors || 832}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Classes */}
            <div className="flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Classes</h3>
              {!loading && dashboardData ? (
                <ul className="space-y-3">
                  {dashboardData.classRankings.slice(0, 5).map((classItem, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white">{classItem.code} {classItem.name.replace(classItem.code, '').trim()}</span>
                      <span className="text-[#92adc9]">{classItem.totalCommits.toLocaleString()} commits</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3 opacity-50">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-white">Loading class data...</span>
                    <span className="text-[#92adc9]">...</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Top Departments */}
            <div className="flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Departments</h3>
              {!loading && dashboardData ? (
                <ul className="space-y-3">
                  {dashboardData.departmentRankings.map((dept, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white">{dept.name}</span>
                      <span className="text-[#92adc9]">{dept.totalCommits.toLocaleString()} commits</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3 opacity-50">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-white">Loading department data...</span>
                    <span className="text-[#92adc9]">...</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Top Individual Contributors */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Individual Contributors</h3>
              {!loading && dashboardData ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <tbody className="divide-y divide-[#324d67]">
                      {dashboardData.topContributors.map((contributor, index) => (
                        <tr key={index}>
                          <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">{contributor.name}</td>
                          <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">
                            {contributor.className.replace(/ - Class of \d{4}/, '')}
                          </td>
                          <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">{contributor.totalCommits.toLocaleString()} commits</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto opacity-50">
                  <table className="min-w-full">
                    <tbody className="divide-y divide-[#324d67]">
                      <tr>
                        <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">Loading contributor data...</td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">...</td>
                        <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
