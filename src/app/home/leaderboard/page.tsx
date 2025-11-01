'use client'

import { useState, useEffect } from 'react'

interface LeaderboardData {
  individuals: Array<{
    rank: number
    id: string
    name: string
    githubUsername: string
    department: string
    className?: string
    classCode?: string
    totalCommits: number
  }>
  classes: Array<{
    rank: number
    name: string
    department: string
    studentCount: number
    avgCommits: number
    totalCommits: number
  }>
  departments: Array<{
    rank: number
    name: string
    facultySize: number
    studentCount: number
    avgCommits: number
    totalCommits: number
  }>
  metadata: {
    totalStudents: number
    lastUpdated: string
    dataSource: string
  }
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('individuals')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('totalCommits')

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/leaderboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard data: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.data) {
        setLeaderboardData(result.data)
      } else {
        throw new Error(result.message || 'Failed to load leaderboard data')
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  if (activeTab === 'departments') {
    return (
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
          <p className="text-white/60 mt-2">See where your class and department rank. Keep pushing to climb to the top!</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </header>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('individuals')}
              >
                Individuals
              </button>
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('classes')}
              >
                Classes
              </button>
              <button
                className="bg-[#233648] text-white text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                  <option>Sort by Total Commits</option>
                  <option>Sort by Avg. Commits</option>
                  <option>Sort by Faculty Size</option>
                  <option>Sort by Student Enrollment</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-[#233648]">
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Total Students</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Avg. Commits / Student</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Total Commits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#324d67]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-white/60">
                      Loading departments...
                    </td>
                  </tr>
                ) : leaderboardData?.departments && leaderboardData.departments.length > 0 ? (
                  leaderboardData.departments.map((dept) => (
                    <tr key={dept.name} className="hover:bg-[#233648]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {dept.rank === 1 && <span className="text-lg font-bold text-[#facc15]">🥇</span>}
                        {dept.rank === 2 && <span className="text-lg font-bold text-[#c0c0c0]">🥈</span>}
                        {dept.rank === 3 && <span className="text-lg font-bold text-[#cd7f32]">🥉</span>}
                        {dept.rank > 3 && <span className="text-base font-medium">{dept.rank}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{dept.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-base font-medium">{dept.studentCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-base font-medium">{dept.avgCommits}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-semibold">{dept.totalCommits.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-white/60">
                      No department data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'classes') {
    return (
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
          <p className="text-white/60 mt-2">See where your class and department rank. Keep pushing to climb to the top!</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </header>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('individuals')}
              >
                Individuals
              </button>
              <button
                className="bg-[#233648] text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('classes')}
              >
                Classes
              </button>
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]"
                >
                  <option value="all">All Departments</option>
                  {leaderboardData?.departments?.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]"
                >
                  <option value="totalCommits">Sort by Total Commits</option>
                  <option value="avgCommits">Sort by Avg. Commits</option>
                  <option value="studentCount">Sort by Students</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-[#233648]">
                    <th className="px-3 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider w-16">Rank</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Class Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider w-20">Students</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider w-24">Avg Commits</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider w-28">Total Commits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-white/60">
                        Loading classes...
                      </td>
                    </tr>
                  ) : leaderboardData?.classes && leaderboardData.classes.length > 0 ? (
                    leaderboardData.classes
                      .filter((cls) => selectedDepartment === 'all' || cls.department === selectedDepartment)
                      .sort((a, b) => {
                        // Sort in descending order (highest first)
                        if (sortBy === 'totalCommits') {
                          return b.totalCommits - a.totalCommits
                        } else if (sortBy === 'avgCommits') {
                          return b.avgCommits - a.avgCommits
                        } else if (sortBy === 'studentCount') {
                          return b.studentCount - a.studentCount
                        }
                        return 0
                      })
                      .map((cls, index) => {
                        // Calculate new rank based on sorted position
                        const newRank = index + 1
                        return (
                          <tr key={cls.name} className="hover:bg-[#233648]/50 transition-colors">
                            <td className="px-3 py-4 whitespace-nowrap text-center w-16">
                              {newRank === 1 && <span className="text-lg font-bold text-[#facc15]">🥇</span>}
                              {newRank === 2 && <span className="text-lg font-bold text-[#c0c0c0]">🥈</span>}
                              {newRank === 3 && <span className="text-lg font-bold text-[#cd7f32]">🥉</span>}
                              {newRank > 3 && <span className="text-base font-medium">{newRank}</span>}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap font-medium max-w-xs truncate" title={cls.name}>{cls.name}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-white/80 max-w-xs truncate" title={cls.department}>{cls.department}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-base font-medium w-20">{cls.studentCount}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-base font-medium w-24">{cls.avgCommits}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-lg font-semibold w-28">{cls.totalCommits.toLocaleString()}</td>
                          </tr>
                        )
                      })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-white/60">
                        No class data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: Individuals tab
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
        <p className="text-white/60 mt-2">See where you and your peers rank. Keep pushing to climb to the top!</p>
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </header>
      <div className="flex flex-col gap-8 ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="bg-[#233648] text-white text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('individuals')}
            >
              Individuals
            </button>
            <button
              className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('classes')}
            >
              Classes
            </button>
            <button
              className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('departments')}
            >
              Departments
            </button>
          </div>

        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-[#233648]">
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Total Commits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#324d67]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : leaderboardData?.individuals && leaderboardData.individuals.length > 0 ? (
                  leaderboardData.individuals.map((student) => (
                    <tr key={student.id} className="hover:bg-[#233648]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {student.rank === 1 && <span className="text-lg font-bold text-[#facc15]">🥇</span>}
                        {student.rank === 2 && <span className="text-lg font-bold text-[#c0c0c0]">🥈</span>}
                        {student.rank === 3 && <span className="text-lg font-bold text-[#cd7f32]">🥉</span>}
                        {student.rank > 3 && <span className="text-base font-medium">{student.rank}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold uppercase">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{student.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {student.rank <= 3 ? (
                          <span className="text-lg font-semibold">{student.totalCommits.toLocaleString()}</span>
                        ) : (
                          <span className="text-base font-medium">{student.totalCommits.toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                      No leaderboard data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
