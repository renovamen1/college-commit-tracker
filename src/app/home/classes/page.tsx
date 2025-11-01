'use client'

import { useState, useEffect } from 'react'

interface ClassInfo {
  id: string
  name: string
  code: string
  department: string
  academicYear: string
  semester: string
  displayName: string
}

interface ClassData {
  overview: {
    totalCommits: number
    activeContributors: number
  }
  members: Array<{
    id: string
    name: string
    githubUsername: string
    totalCommits: number
  }>
  classInfo: {
    id: string
    name: string
    code: string
    department: string
    academicYear: string
    semester: string
    githubRepo?: string
  }
}

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch classes list on component mount
  useEffect(() => {
    fetchClasses()
  }, [])

  // Fetch class data when selected class changes
  useEffect(() => {
    if (selectedClassId) {
      fetchClassData(selectedClassId)
    }
  }, [selectedClassId])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const result = await response.json()
      if (result.success) {
        setClasses(result.data.classes)
        // Auto-select first class if available
        if (result.data.classes.length > 0) {
          setSelectedClassId(result.data.classes[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchClassData = async (classId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/classes/${classId}`)
      const result = await response.json()
      if (result.success) {
        setClassData(result.data)
      } else {
        setError(result.message || 'Failed to load class data')
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
      setError('Failed to load class data')
    } finally {
      setLoading(false)
    }
  }

  const selectedClass = classes.find(cls => cls.id === selectedClassId)

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header with Class Selector */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter min-w-72">
            {selectedClass ? selectedClass.displayName : 'Select a Class'}
          </h1>
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="form-select w-72 appearance-none rounded-md border border-[#324d67] bg-[#192633] px-4 py-2.5 text-white focus:border-[#1172d4] focus:outline-none focus:ring-1 focus:ring-[#1172d4]"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.displayName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
        </div>
        <p className="text-white/60 mt-2">
          {classData?.classInfo ? `Detailed view of ${classData.classInfo.name} activity and contributions.` : 'Select a class to view detailed activity and contributions.'}
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-[#324d67]">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-center border-b-2 transition-colors pb-3 pt-1 ${
              activeTab === 'overview' ? 'border-b-[#1172d4] text-white' : 'border-b-transparent text-white/60 hover:text-white'
            }`}
          >
            <p className="text-sm font-semibold leading-normal">Overview</p>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center justify-center border-b-2 transition-colors pb-3 pt-1 ${
              activeTab === 'members' ? 'border-b-[#1172d4] text-white' : 'border-b-transparent text-white/60 hover:text-white'
            }`}
          >
            <p className="text-sm font-semibold leading-normal">Members</p>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {loading && (
            <div className="mt-8 text-center">
              <p className="text-white/60">Loading class data...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-500/50 rounded-md">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {classData && !loading && !error && (
            <>
              {/* Activity Metrics */}
              <section className="mt-8">
                <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Activity Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
                    <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
                    <p className="text-white tracking-light text-3xl font-bold leading-tight">
                      {classData.overview.totalCommits.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
                    <p className="text-white/60 text-base font-medium leading-normal">Active Contributors</p>
                    <p className="text-white tracking-light text-3xl font-bold leading-tight">
                      {classData.overview.activeContributors}
                    </p>
                  </div>
                </div>
              </section>

              {/* Member Contributions */}
              <section className="mt-12">
                <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Top Contributors</h2>
                <div className="mt-4 overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
                      <table className="min-w-full divide-y divide-[#324d67]">
                        <thead className="bg-[#192633]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">GitHub Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Commits</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#324d67]">
                          {classData.members.slice(0, 5).map((member, index) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{member.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">@{member.githubUsername}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">{member.totalCommits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}

      {/* Members Tab Content */}
      {activeTab === 'members' && (
        <section className="mt-8">
          {loading && (
            <div className="text-center">
              <p className="text-white/60">Loading members...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {classData && !loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Members List</h2>
                <div className="text-white/60 text-sm">
                  {classData.members.length} total members
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
                    <table className="min-w-full divide-y divide-[#324d67]">
                      <thead className="bg-[#192633]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">GitHub Username</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Total Commits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#324d67]">
                        {classData.members.map((member, index) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">@{member.githubUsername}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">{member.totalCommits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}


    </div>
  )
}
