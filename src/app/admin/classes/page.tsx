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
                <Link href="#" className="text-white text-sm font-medium">
                  Classes
                </Link>
                <button className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                  Logout
                </button>
                <Link href="/profile" className="text-gray-400 hover:text-white">
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.1-31.31,47.69-48,80.08-48s61.98,16.69,80.08,48a8,8,0,0,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </Link>
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
    </>
  )
}
