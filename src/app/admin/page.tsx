'use client'

import { useState } from 'react'

export default function AdminDashboard() {
  const [manageDropdown, setManageDropdown] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    linkGithub: false,
    role: 'Student',
    password: '',
    confirmPassword: ''
  })

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

  return (
    <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden bg-gray-900">
      <header className="flex w-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0KnE2jd8h3b0pibOe4BArlpWB7LIgOmyO9vBjOLFB6kXPhHvbIV4J7i6PB0wpptddY074exSZivxrA36jGpD9uh7Ed4FWzVhvWi2zSND5WyCWan_jPOk8AXAmGPAwH-6gUxwKwtNTIpoUcEZF0KRGgmIwe2rWA4GPBANO38sxoVTP3AzhNZzgMDf6LQbXpxYbA8KeIX1jl7ZUeR-aa90RRvsx4ft-zec0PKE7vbMM7B16Zq0fJWHndaDabIQp27t2Fd7Yro-1zMA")`
              }}
            ></div>
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
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${manageDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              <div className={`absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${manageDropdown ? 'block' : 'hidden'}`}>
                <div className="py-1">
                  <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" href="/admin/students" role="menuitem">
                    Users
                  </a>
                  <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" href="/admin/manage" role="menuitem">
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
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.1-31.31,47.69-48,80.08-48s61.98,16.69,80.08,48a8,8,0,0,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </a>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white tracking-light text-4xl font-bold leading-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900">
              <span className="truncate">Export Data</span>
            </button>
            <button
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={() => setShowAddUserModal(true)}
            >
              <span className="truncate">Add User</span>
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 @container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-md border border-gray-800 bg-gray-950 p-6">
              <p className="text-gray-400 text-sm font-normal leading-normal">Total Users</p>
              <p className="text-white tracking-tight text-4xl font-bold leading-tight">1,234</p>
            </div>
            <div className="flex flex-col gap-2 rounded-md border border-gray-800 bg-gray-950 p-6">
              <p className="text-gray-400 text-sm font-normal leading-normal">Active Departments</p>
              <p className="text-white tracking-tight text-4xl font-bold leading-tight">12</p>
            </div>
            <div className="flex flex-col gap-2 rounded-md border border-gray-800 bg-gray-950 p-6">
              <p className="text-gray-400 text-sm font-normal leading-normal">Contributions Today</p>
              <p className="text-white tracking-tight text-4xl font-bold leading-tight">5,678</p>
            </div>
            <div className="flex flex-col gap-2 rounded-md border border-gray-800 bg-gray-950 p-6">
              <p className="text-gray-400 text-sm font-normal leading-normal">Total Classes</p>
              <p className="text-white tracking-tight text-4xl font-bold leading-tight">42</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md border border-gray-800 bg-gray-950 p-6">
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-800 text-white text-sm font-medium leading-normal transition-all hover:bg-gray-700">
                  Manage Users
                </button>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-800 text-white text-sm font-medium leading-normal transition-all hover:bg-gray-700">
                  Manage Departments
                </button>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-800 text-white text-sm font-medium leading-normal transition-all hover:bg-gray-700">
                  System Settings
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Data Management</h2>
              <div className="flex flex-col gap-4 rounded-md border border-gray-800 bg-gray-950 p-6">
                <h3 className="text-white text-lg font-bold leading-normal">Import Data</h3>
                <p className="text-sm text-gray-400">Upload a CSV or Excel file to add or update user and department data.</p>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800" htmlFor="dropzone-file">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg aria-hidden="true" className="w-8 h-8 mb-2 text-gray-500" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">CSV or XLSX (MAX. 5MB)</p>
                    </div>
                    <input className="hidden" id="dropzone-file" type="file"/>
                  </label>
                </div>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-800 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all hover:bg-gray-700 self-start">
                  <span className="truncate">Upload File</span>
                </button>
              </div>
            </div>
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
                    <a
                      className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowAddUserModal(false)}
                    >
                      <svg className="lucide lucide-x" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      <span>Cancel</span>
                    </a>
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
      </main>
    </div>
  )
}
