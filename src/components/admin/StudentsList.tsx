'use client'

import { useState, useEffect, Suspense } from 'react'
import { User, GitBranch, Calendar, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react'

interface Student {
  id: string
  githubUsername: string
  name: string | null
  email: string
  totalCommits: number
  lastSyncDate: Date | null
  createdAt: Date
  className: string | null
}

type SortField = 'name' | 'githubUsername' | 'totalCommits' | 'lastSyncDate' | 'createdAt'
type SortDirection = 'asc' | 'desc'

interface StudentsListProps {
  initialStudents?: Student[]
  maxPerPage?: number
  onStudentSelect?: (student: Student) => void
}

function StudentsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function fetchStudents(page: number, limit: number): Promise<Student[]> {
  const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch students')
  const data = await res.json()
  return data.users || []
}

export default function StudentsList({ initialStudents, maxPerPage = 20, onStudentSelect }: StudentsListProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents || [])
  const [loading, setLoading] = useState(!initialStudents)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    fetchStudentsData()
  }, [currentPage])

  const fetchStudentsData = async () => {
    try {
      setLoading(true)
      const data = await fetchStudents(currentPage, maxPerPage)
      setStudents(data)
      setTotalPages(Math.ceil(data.length / maxPerPage))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name || a.githubUsername
        bValue = b.name || b.githubUsername
        break
      case 'githubUsername':
        aValue = a.githubUsername
        bValue = b.githubUsername
        break
      case 'totalCommits':
        aValue = a.totalCommits
        bValue = b.totalCommits
        break
      case 'lastSyncDate':
        aValue = a.lastSyncDate ? new Date(a.lastSyncDate).getTime() : 0
        bValue = b.lastSyncDate ? new Date(b.lastSyncDate).getTime() : 0
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded text-xs font-medium"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
      )}
    </button>
  )

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Students ({loading ? '...' : students.length})
        </h2>
        {loading && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <SortButton field="name">Name</SortButton>
        <SortButton field="githubUsername">Username</SortButton>
        <SortButton field="totalCommits">Commits</SortButton>
        <SortButton field="lastSyncDate">Last Sync</SortButton>
        <SortButton field="createdAt">Joined</SortButton>
      </div>

      {/* Students List */}
      {loading ? (
        <StudentsListSkeleton />
      ) : sortedStudents.length > 0 ? (
        <div className="space-y-3">
          {sortedStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onStudentSelect?.(student)}
            >
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {(student.name || student.githubUsername).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {student.name || 'No name'}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <GitBranch className="h-3 w-3 mr-1" />
                    @{student.githubUsername}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {student.totalCommits} commits
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span>• {student.email}</span>
                  {student.className && <span>• Class: {student.className}</span>}
                  {student.lastSyncDate && <span>• Last sync: {new Date(student.lastSyncDate).toLocaleDateString()}</span>}
                  <span>• Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No students found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Wrapper with Suspense
export function StudentsListWithSuspense(props: StudentsListProps) {
  return (
    <Suspense fallback={<StudentsListSkeleton />}>
      <StudentsList {...props} />
    </Suspense>
  )
}
