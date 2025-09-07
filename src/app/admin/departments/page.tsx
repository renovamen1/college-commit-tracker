'use client'

import { useState, useEffect, useCallback } from 'react'

interface Department {
  id: string
  name: string
  description: string
  classes: string[]
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

export default function DepartmentsPage() {
  const [manageDropdown, setManageDropdown] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [newDepartmentDescription, setNewDepartmentDescription] = useState('')
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [departmentName, setDepartmentName] = useState('Computer Science')

  const fetchDepartments = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/departments?${params}`)
      const data = await response.json()
      setDepartments(data.departments)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments(currentPage, searchTerm)
  }, [currentPage, searchTerm, fetchDepartments])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return

    try {
      const response = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newDepartmentName.trim(),
          description: newDepartmentDescription.trim()
        })
      })

      if (response.ok) {
        setNewDepartmentName('')
        setNewDepartmentDescription('')
        setShowAddModal(false)
        fetchDepartments(currentPage, searchTerm)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error adding department:', error)
      alert('Failed to add department')
    }
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return

    try {
      const response = await fetch(`/api/admin/departments/${departmentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDepartments(currentPage, searchTerm)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      alert('Failed to delete department')
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0KnE2jd8h3b0pibOe4BArlpWB7LIgOmyO9vBjOLFB6kXPhHvbIV4J7i6PB0wpptddY074exSZivxrA36jGpD9uh7Ed4FWzVhvWi2zSND5WyCWan_jPOk8AXAmGPAwH-6gUxwKwtNTIpoUcEZF0KRGgmIwe2rWA4GPBANO38sxoVTP3AzhNZzgMDf6LQbXpxYbA8KeIX1jl7ZUeR-aa90RRvsx4ft-zec0PKE7vbMM7B16Zq0fJWHndaDabIQp27t2Fd7Yro-1zMA")`
                }}
              />
              <h1 className="text-white text-lg font-bold leading-normal">CodeCommit</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/admin" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </a>
              <a href="/admin/leaderboard" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Leaderboard
              </a>
              <a href="/admin/classes" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Classes
              </a>
              <button className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                Logout
              </button>
              <a href="/profile" className="text-gray-400 hover:text-white">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.1-31.31,47.69-48,80.08-48s61.98,16.69,80.08,48a8,8,0,0,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                </svg>
              </a>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white tracking-light text-4xl font-bold leading-tight">Manage Departments</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
                <span className="truncate">Add Department</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-lg border border-gray-800 bg-gray-950 p-6">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                </svg>
                <input
                  className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search departments..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Department Name
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </th>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Classes
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </th>
                    <th className="py-3 px-6">
                      <button className="flex items-center gap-1">
                        Students
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                        Loading departments...
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="hover:bg-gray-900">
                        <td className="whitespace-nowrap py-4 px-6 font-medium text-white">Computer Science</td>
                        <td className="py-4 px-6 text-gray-300">CS101, CS202, CS350</td>
                        <td className="py-4 px-6 text-gray-300">452</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setShowEditModal(true)}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment('cs')}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-900">
                        <td className="whitespace-nowrap py-4 px-6 font-medium text-white">Mathematics</td>
                        <td className="py-4 px-6 text-gray-300">MATH101, MATH203, STAT301</td>
                        <td className="py-4 px-6 text-gray-300">210</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setShowEditModal(true)}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment('math')}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-900">
                        <td className="whitespace-nowrap py-4 px-6 font-medium text-white">Electrical Engineering</td>
                        <td className="py-4 px-6 text-gray-300">EE101, EE220, EE345</td>
                        <td className="py-4 px-6 text-gray-300">350</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setShowEditModal(true)}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment('ee')}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-900">
                        <td className="whitespace-nowrap py-4 px-6 font-medium text-white">Physics</td>
                        <td className="py-4 px-6 text-gray-300">PHYS101, PHYS210, PHYS305</td>
                        <td className="py-4 px-6 text-gray-300">180</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setShowEditModal(true)}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment('phys')}
                              className="flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <p className="text-sm text-gray-400">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} departments
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

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-white tracking-light text-3xl font-bold leading-tight">Add Department</h1>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleAddDepartment(); }} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Department Name
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 text-white py-3 px-4"
                        id="name"
                        name="name"
                        placeholder="e.g. Computer Science"
                        type="text"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 text-white py-3 px-4"
                        id="description"
                        name="description"
                        placeholder="Brief description..."
                        rows={3}
                        value={newDepartmentDescription}
                        onChange={(e) => setNewDepartmentDescription(e.target.value)}
                      />
                    </div>
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
                      Add Department
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-6 pt-6 pb-8">
                <div className="flex items-center mb-8">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span>Back to Departments</span>
                  </button>
                </div>
                <h1 className="text-white tracking-light text-4xl font-bold leading-tight mb-8">Edit Department</h1>
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-6">
                  <form className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="department-name">Department Name</label>
                      <input
                        className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 px-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        id="department-name"
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Associated Classes</label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-3">
                          <span className="text-white">CS101 - Introduction to Programming</span>
                          <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-white" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-red-500" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-3">
                          <span className="text-white">CS202 - Data Structures</span>
                          <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-white" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-red-500" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-3">
                          <span className="text-white">CS350 - Operating Systems</span>
                          <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-white" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-red-500" type="button">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-700 py-3 px-4 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full" type="button">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>Add New Class</span>
                      </button>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
                      <button
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900"
                        type="button"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
