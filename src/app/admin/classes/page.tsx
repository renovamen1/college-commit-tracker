'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ClassItem {
  id: string
  name: string
  department: string
  students: number
}

const mockClasses: ClassItem[] = [
  {
    id: '1',
    name: 'CS101: Intro to Computer Science',
    department: 'Computer Science',
    students: 120
  },
  {
    id: '2',
    name: 'MATH203: Linear Algebra',
    department: 'Mathematics',
    students: 85
  },
  {
    id: '3',
    name: 'PHYS101: General Physics I',
    department: 'Physics',
    students: 150
  },
  {
    id: '4',
    name: 'ENGL101: English Composition',
    department: 'English',
    students: 95
  },
  {
    id: '5',
    name: 'CS341: Algorithms',
    department: 'Computer Science',
    students: 70
  },
  {
    id: '6',
    name: 'HIST212: American History',
    department: 'History',
    students: 60
  }
]

export default function ClassesManagePage() {
  const [classes] = useState<ClassItem[]>(mockClasses)
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showSuccessMessage = (message: string) => {
    // For now, just show alert - could be replaced with toast notification
    alert(message)
  }

  return (
    <>
      <style jsx>{`
        :root {
          --primary-color: #1173d4;
        }
      `}</style>

      <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
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
                <Link href="/admin" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/leaderboard" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Leaderboard
                </Link>
                <Link href="/admin/classes" className="text-white text-sm font-medium">
                  Classes
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to log out?')) {
                      try {
                        await fetch('/api/admin/login', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        })
                        localStorage.removeItem('admin_user')
                        window.location.href = '/admin/login'
                      } catch (error) {
                        localStorage.removeItem('admin_user')
                        window.location.href = '/admin/login'
                      }
                    }
                  }}
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-gray-400 hover:text-white relative"
                >
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.1-31.31,47.69-48,80.08-48s61.98,16.69,80.08,48a8,8,0,0,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </header>

          <main className="flex flex-1 flex-col p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-white tracking-light text-4xl font-bold leading-tight">Manage Classes</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search classes..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span className="material-symbols-outlined">add</span>
                  <span className="truncate">Add New Class</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Class Name <span className="material-symbols-outlined text-base">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Department <span className="material-symbols-outlined text-base">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Students <span className="material-symbols-outlined text-base">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls, index) => (
                    <tr key={cls.id} className={`border-b border-gray-800 bg-gray-950 hover:bg-gray-900 ${index === filteredClasses.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-white">{cls.name}</td>
                      <td className="px-6 py-4">{cls.department}</td>
                      <td className="px-6 py-4">{cls.students}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="mr-2 text-blue-500 hover:text-blue-400"
                          onClick={() => showSuccessMessage('Edit feature coming soon!')}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this class?')) {
                              showSuccessMessage('Class deleted successfully!')
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>

            <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-white text-3xl font-bold mb-8">Moderator Profile & Privileges</h1>
                  <button
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                    onClick={() => setShowProfileModal(false)}
                  >
                    <svg className="lucide lucide-x" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-lg">
                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <img
                          alt="Moderator Avatar"
                          className="h-24 w-24 rounded-full border-4 border-gray-800"
                          src="https://lh3.googleusercontent.com/a/ACg8ocJk_GZJpY5l7eQ4e7wZz3f4A8oY8j5eP8nI_FpYk9b=s96-c"
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-5 w-5 border-2 border-gray-950"></div>
                      </div>
                      <div>
                        <h2 className="text-white text-2xl font-bold">Jane Doe</h2>
                        <p className="text-gray-400">jane.doe@university.edu</p>
                        <p className="text-gray-500 text-sm mt-1">Role: Moderator</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold mb-4">Assigned Privileges</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="material-symbols-outlined text-green-500">check_circle</span>
                          <span>Can manage users (Add, Edit, Suspend)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="material-symbols-outlined text-green-500">check_circle</span>
                          <span>Can manage content (Posts, Comments)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="material-symbols-outlined text-red-500">cancel</span>
                          <span>Cannot manage departments</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="material-symbols-outlined text-red-500">cancel</span>
                          <span>Cannot manage classes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 p-8 flex justify-end">
                    <button
                      onClick={async () => {
                        setShowProfileModal(false)
                        if (confirm('Are you sure you want to log out?')) {
                          try {
                            await fetch('/api/admin/login', {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            })
                            localStorage.removeItem('admin_user')
                            window.location.href = '/admin/login'
                          } catch (error) {
                            localStorage.removeItem('admin_user')
                            window.location.href = '/admin/login'
                          }
                        }
                      }}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all hover:bg-red-700"
                    >
                      <span className="truncate">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
