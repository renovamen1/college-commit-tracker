'use client'

import { useState, useEffect, useCallback } from 'react'

interface ClassItem {
  id: string
  name: string
  department: string
  studentCount: number
  totalCommits: number
  createdAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
}

export default function ClassesPage() {
  const [manageDropdown, setManageDropdown] = useState(false)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [newClassDepartment, setNewClassDepartment] = useState('')
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [departments, setDepartments] = useState<string[]>([])

  const fetchClasses = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/classes?${params}`)
      const data = await response.json()
      setClasses(data.classes)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/departments?limit=100')
      const data = await response.json()
      setDepartments(data.departments?.map((dept: any) => dept.name) || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
      // Fallback to common departments if API fails
      setDepartments(['Computer Science', 'Mathematics', 'Physics', 'Electrical Engineering', 'Mechanical Engineering'])
    }
  }, [])

  useEffect(() => {
    fetchClasses(currentPage, searchTerm)
    fetchDepartments()
  }, [currentPage, searchTerm, fetchClasses, fetchDepartments])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleAddClass = async () => {
    if (!newClassName.trim() || !newClassDepartment.trim()) return

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newClassName.trim(),
          department: newClassDepartment.trim()
        })
      })

      if (response.ok) {
        setNewClassName('')
        setNewClassDepartment('')
        setShowAddModal(false)
        fetchClasses(currentPage, searchTerm)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error adding class:', error)
      alert('Failed to add class')
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return

    try {
      const response = await fetch(`/api/admin/classes/${classId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchClasses(currentPage, searchTerm)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class')
    }
  }

  const renderTableRow = (cls: ClassItem) => (
    <tr key={cls.id} className="hover:bg-gray-900">
      <td className="whitespace-nowrap py-4 px-6 font-medium text-white">
        {cls.name}
      </td>
      <td className="py-4 px-6 text-gray-300">
        {cls.department}
      </td>
      <td className="py-4 px-6 text-gray-300">
        {cls.studentCount}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg className="h-4 w-4" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClass(cls.id)}
            className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden bg-gray-900">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0KnE2jd8h3b0pibOe4BArlpWB7LIgOmyO9vBjOLFB6kXPhHvbIV4J7i6PB0wpptddY074exSZivxrA36jGpD9uh7Ed4FWzVhvWi2zSND5WyCWan_jPOk8AXAmGPAwH-6gUxwKwtNTIpoUcEZF0KRGgmIwe2rWA4GPBANO38sxoVTP3AzhNZzgMDf6LQbXpxYbA8KeIX1jl7ZUeR-aa90RRvsx4ft-zec0PKE7vbMM7B16Zq0fJWHndaDabIQp27t2Fd7Yro-1zMA")'}}></div>
              <h1 className="text-white text-lg font-bold leading-normal">CodeCommit</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="/admin">
                Dashboard
              </a>
              <a className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="/admin/leaderboard">
                Leaderboard
              </a>
              <div className="group relative">
                <button
                  className="flex items-center gap-1 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  onClick={() => setManageDropdown(!manageDropdown)}
                >
                  <span>Manage</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${manageDropdown ? 'rotate-180' : ''}`} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className={`absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${manageDropdown ? 'block' : 'hidden'}`}>
                  <div className="py-1">
                    <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" href="/admin" role="menuitem">
                      Dashboard
                    </a>
                    <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" href="/admin/departments" role="menuitem">
                      Departments & Classes
                    </a>
                    <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" href="#" role="menuitem">
                      Settings
                    </a>
                  </div>
                </div>
              </div>
              <a className="text-gray-400 hover:text-white" href="/profile">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.1-31.31,47.69-48,80.08-48s61.98,16.69,80.08,48a8,8,0,0,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                </svg>
              </a>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white tracking-light text-4xl font-bold leading-tight">Manage Classes</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg className="mr-2 h-5 w-5" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
                <span className="truncate">Add Class</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-lg border border-gray-800 bg-gray-950 p-6">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                </svg>
                <input
                  className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search classes..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Class Name
                        <svg className="h-4 w-4" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </th>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Department
                        <svg className="h-4 w-4" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </th>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Students
                        <svg className="h-4 w-4" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Loading classes...
                      </td>
                    </tr>
                  ) : classes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        No classes found
                      </td>
                    </tr>
                  ) : (
                    classes.map(renderTableRow)
                  )}
                </tbody>
              </table>
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <p className="text-sm text-gray-400">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} classes
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={pagination.currentPage === 1}
                    className="rounded-md border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="rounded-md border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-white tracking-light text-3xl font-bold leading-tight">Add Class</h1>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="lucide lucide-x" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleAddClass(); }} className="space-y-6">
                  <div>
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300">
                      Class Name
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white py-3 px-4"
                        id="className"
                        name="className"
                        placeholder="e.g. CS101, MATH203"
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-300">
                      Department
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 py-3 pl-3 pr-10 text-base text-white focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm"
                      id="department"
                      value={newClassDepartment}
                      onChange={(e) => setNewClassDepartment(e.target.value)}
                      required
                    >
                      <option value="">Select a department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-700 text-white text-sm font-medium leading-normal transition-all hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-600 text-white text-sm font-medium leading-normal transition-all hover:bg-blue-700"
                    >
                      Add Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
