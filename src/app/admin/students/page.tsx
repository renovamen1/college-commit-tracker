'use client'

import { useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  lastLogin: string
  avatar: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    role: 'Student',
    department: 'Computer Science',
    lastLogin: '2024-05-20 10:30 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ-Ug7JEv7nKIeyQBX3KhaoUSKn61yS5t-HANBNC8fjRMxzzlsvZPxkL23x9bCXydGLZssCKG2dnwNPb1-sAchtI54OMPavHPWFmkBctBcTF1xOh8D2wNbdiJXfl0ONPEiKbIaYrGeXKtEaxbZ5GFsH8I3aUOMO5rJpBnrqmltp1WBV1_ehEHZ_zrOJ5OgubIpepS7ornkMEaaypGqTieM4pUOfFSNNKLILmi-1g8_qcy6eNzEVY55FYONEDpXVK9Nu_q6AMVxCNk'
  },
  {
    id: '2',
    name: 'Phoenix Baker',
    email: 'phoenix@untitledui.com',
    role: 'Professor',
    department: 'Electrical Engineering',
    lastLogin: '2024-05-21 09:00 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_wM_FYE4PyiAS6wC3SBAPHbWnzcfdA7EXg9ST_CXAKfXkr2Mpck3CRubnUS-03gzbf1UqpLOdANvtTiNyUm5Fazj_E7Kt_upeEaGu425Q_9YXQBpoZTEGh_vZAk9szuJqVgqnug1LJaHTsjtNKDsAMSBoSzIiT2tFmS0Ep63KvT_pP4hE9UJGsGlqfK7ZOsFHEcZ1YSOJqClOSbQmUF61MiiUhH3mODkk_eWxU4tJzn7PuVaz5QUnT0Vrk5i9bsrQEdxoXNfFups'
  },
  {
    id: '3',
    name: 'Lana Steiner',
    email: 'lana@untitledui.com',
    role: 'Admin',
    department: 'Administration',
    lastLogin: '2024-05-21 11:45 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYtkCQ90ioFh2Xm68A1jh2e07gycGIuAEduxxfms1bwGIX76xyC8cMwA0ElPhJAPv4Yf-ZeGjeEHqFUUj8cViHMc2ILEAnmlaUV3wq-t7U8VK44_U5DBYHAdLXsgX9Keb0lA-uNIHnt9HO-97-IMfhQro83G7bGPdcY324h4K7VvdJ9fSVp8lEguSIUAVDnyoXNfp5sWN5FjHBDUP_yp79i2Jhk2bjiymYidA-jt1Rt53GdR-QfPmEMZKY_Kw5UxDV5synz2UJmow'
  },
  {
    id: '4',
    name: 'Demi Wilkinson',
    email: 'demi@untitledui.com',
    role: 'Student',
    department: 'Mathematics',
    lastLogin: '2024-05-19 02:15 PM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKkiqIaKofBbhlLw09tJTLA5LhTBrqushV6aw1HV4ZCNMTwh7EhfvmNRV8ERJuH7ym47H3Pjr3NkfGjA8eX3a5lZBWEUlSzuaWTU2-mKAgTpEehWJ73PVBqvJSlxnxa94yOy2gvnB6iyr6rjFdgHSdjpwgPjCTFnfqetiCMB_gMX5-svkHkLtLqML3aklL46w59dt4o1xvoucT2gK6Qqvmmbajj71uV-q3eB1X92eqPyNlMg_PGVyknvfr1AovcO_9Jy0tpsWZERM'
  }
]

export default function UsersManagePage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')


  const usersPerPage = 10
  const totalPages = Math.ceil(users.length / usersPerPage)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
      showSuccessMessage('User deleted successfully!')
    }
  }

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      showSuccessMessage(`${selectedUsers.length} user(s) deleted successfully!`)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-red-400'
      case 'professor':
        return 'text-purple-400'
      case 'student':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <>
      <style jsx>{`
        :root {
          --primary-color: #1173d4;
        }
        .sortable:after {
          content: 'expand_more';
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          margin-left: 0.25rem;
          font-size: 1.25rem;
        }
      `}</style>

      <div className="relative flex size-full min-h-screen flex-col bg-gray-900 dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
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
                <Link href="/admin/classes" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
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
              <h1 className="text-white tracking-light text-4xl font-bold leading-tight">Manage Users</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    className="bg-gray-800 text-white border-gray-700 rounded-md pl-10 pr-4 py-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                    placeholder="Search users..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {selectedUsers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <span>Delete Selected ({selectedUsers.length})</span>
                  </button>
                )}
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span className="truncate">Add New User</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-gray-400">
                <thead className="bg-gray-800 text-xs text-gray-300 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center">
                        <input
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                          id="checkbox-all"
                          type="checkbox"
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label className="sr-only" htmlFor="checkbox-all">checkbox</label>
                      </div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer sortable" scope="col">User</th>
                    <th className="px-6 py-3 cursor-pointer sortable" scope="col">Role</th>
                    <th className="px-6 py-3 cursor-pointer sortable" scope="col">Department</th>
                    <th className="px-6 py-3 cursor-pointer sortable" scope="col">Last Login</th>
                    <th className="px-6 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-900">
                      <td className="w-4 p-4 px-6">
                        <div className="flex items-center">
                          <input
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                            id={`checkbox-table-${user.id}`}
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          />
                          <label className="sr-only" htmlFor={`checkbox-table-${user.id}`}>checkbox</label>
                        </div>
                      </td>
                      <th className="flex items-center px-6 py-4 text-white whitespace-nowrap" scope="row">
                        <img alt={`${user.name} image`} className="w-10 h-10 rounded-full" src={user.avatar} />
                        <div className="pl-3">
                          <div className="text-base font-semibold">{user.name}</div>
                          <div className="font-normal text-gray-500">{user.email}</div>
                        </div>
                      </th>
                      <td className={`px-6 py-4 ${getRoleColor(user.role)}`}>{user.role}</td>
                      <td className="px-6 py-4">{user.department}</td>
                      <td className="px-6 py-4">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button className="font-medium text-blue-500 hover:underline" onClick={() => showSuccessMessage('Edit feature coming soon!')}>Edit</button>
                          <button className="font-medium text-red-500 hover:underline" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center px-6 py-3 bg-gray-800">
                <span className="text-sm text-gray-300">
                  Showing <span className="font-semibold text-white">{(currentPage - 1) * usersPerPage + 1}-{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span className="font-semibold text-white">{filteredUsers.length}</span>
                </span>
                <div className="inline-flex items-center -space-x-px">
                  <button
                    className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-gray-900 border border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-2 leading-tight text-gray-400 bg-gray-900 border border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Success Feedback Notification */}
            <div
              className={`fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-300 ${successMessage ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span>{successMessage}</span>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
