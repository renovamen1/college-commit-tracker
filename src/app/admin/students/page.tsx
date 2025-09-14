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
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    linkGithub: false,
    role: 'Student',
    password: '',
    confirmPassword: ''
  })


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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Creating user:', formData)
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      githubUsername: '',
      linkGithub: false,
      role: 'Student',
      password: '',
      confirmPassword: ''
    })
    setShowAddUserModal(false)
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
                <Link href="/home" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/home/leaderboard" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Leaderboard
                </Link>
                <Link href="/home/classes" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
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
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900"
                >
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-white tracking-light text-3xl font-bold leading-tight">Create New User</h1>
                  <button
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                    onClick={() => setShowAddUserModal(false)}
                  >
                    <svg className="lucide lucide-x" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white py-3 px-4"
                        id="name"
                        name="name"
                        placeholder="e.g. Prabin Thakur"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white py-3 px-4"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      <p className="mt-2 text-xs text-red-500 hidden">Please enter a valid email address.</p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="github-username" className="block text-sm font-medium text-gray-300">
                      GitHub Username
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 sm:text-sm">
                        github.com/
                      </span>
                      <input
                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md bg-gray-600 border-gray-700 focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white"
                        id="github-username"
                        name="githubUsername"
                        placeholder="your-username"
                        type="text"
                        value={formData.githubUsername}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mt-2 flex items-center">
                      <input
                        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
                        id="link-github"
                        name="linkGithub"
                        type="checkbox"
                        checked={formData.linkGithub}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="link-github" className="ml-2 block text-sm text-gray-400">
                        Link GitHub account now
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                      Role
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 py-3 pl-3 pr-10 text-base text-white focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option>Student</option>
                      <option>Admin</option>
                      <option>Instructor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white py-3 px-4"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-white py-3 px-4"
                        id="confirm-password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <p className="mt-2 text-xs text-red-500 hidden">Passwords do not match.</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-600"
                      type="submit"
                    >
                      Create User Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
