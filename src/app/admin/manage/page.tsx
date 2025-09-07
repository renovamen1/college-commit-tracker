'use client'

import { useState } from 'react'

interface Moderator {
  id: string
  name: string
  email: string
  permissions: string
  status: 'active' | 'inactive'
}

const mockModerators: Moderator[] = [
  {
    id: '1',
    name: 'Ethan Harper',
    email: 'ethan.harper@email.com',
    permissions: 'Full Access',
    status: 'active'
  },
  {
    id: '2',
    name: 'Olivia Bennett',
    email: 'olivia.bennett@email.com',
    permissions: 'User Management',
    status: 'active'
  },
  {
    id: '3',
    name: 'Noah Carter',
    email: 'noah.carter@email.com',
    permissions: 'Class Management',
    status: 'active'
  },
  {
    id: '4',
    name: 'Ava Morgan',
    email: 'ava.morgan@email.com',
    permissions: 'Department Management',
    status: 'active'
  },
  {
    id: '5',
    name: 'Liam Foster',
    email: 'liam.foster@email.com',
    permissions: 'Limited Access',
    status: 'inactive'
  }
]

const getPermissionBadgeColor = (permission: string) => {
  switch (permission.toLowerCase()) {
    case 'full access':
      return 'bg-green-500/20 text-green-400'
    case 'user management':
      return 'bg-blue-500/20 text-blue-400'
    case 'class management':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'department management':
      return 'bg-indigo-500/20 text-indigo-400'
    case 'limited access':
      return 'bg-gray-500/20 text-gray-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

export default function ManageModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>(mockModerators)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredModerators = moderators.filter(moderator =>
    moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    moderator.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoveModerator = (id: string) => {
    if (confirm('Are you sure you want to remove this moderator?')) {
      setModerators(moderators.filter((moderator) => moderator.id !== id))
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
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

        <main className="flex-1 p-8 bg-[#111827]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Moderators</h1>
              <p className="text-gray-400">View and manage moderators for the platform.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1173d4] text-white rounded-md hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined">add</span>
              <span>Add New Moderator</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#1173d4]"
                placeholder="Search moderators by name or email"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-700/50 bg-[#1f2937]">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800/50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3" scope="col">Name</th>
                  <th className="px-6 py-3" scope="col">Email</th>
                  <th className="px-6 py-3" scope="col">Permissions</th>
                  <th className="px-6 py-3 text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredModerators.map((moderator) => (
                  <tr key={moderator.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-white">{moderator.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{moderator.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionBadgeColor(moderator.permissions)}`}>
                        {moderator.permissions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button className="text-[#1173d4] hover:text-blue-500 transition-colors">Edit Permissions</button>
                      <button
                        className="text-red-500 hover:text-red-400 transition-colors ml-4"
                        onClick={() => handleRemoveModerator(moderator.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button className="px-6 py-3 bg-[#1173d4] text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-lg">
              Save Changes
            </button>
          </div>

          {/* Add New Moderator Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-900 opacity-75" aria-hidden="true"></div>
                <div className="inline-block w-full max-w-md p-6 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 border border-gray-700 rounded-lg shadow-xl sm:my-8 sm:align-middle">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Add New Moderator</h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <input
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full name"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email address"
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Permissions</label>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>User Management</option>
                        <option>Class Management</option>
                        <option>Department Management</option>
                        <option>Limited Access</option>
                        <option>Full Access</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                      >
                        Add Moderator
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
