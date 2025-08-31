'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Pencil, Trash2, X, Check } from 'lucide-react'

export function AdminPanel() {
  return (
    <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden bg-[#111a22]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          {/* Sidebar */}
          <Sidebar activeItem="home" />

          {/* Main Content */}
          <main className="flex max-w-7xl flex-1 flex-col p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-white tracking-light text-4xl font-bold leading-tight min-w-72">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span className="truncate">Export Data</span>
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span className="truncate">Add User</span>
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-8 @container">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>

              {/* Manage Users Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                  Manage Users
                </h2>
                <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-950">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="p-4 text-sm font-semibold text-gray-400">Name</th>
                        <th className="p-4 text-sm font-semibold text-gray-400">Department</th>
                        <th className="p-4 text-sm font-semibold text-gray-400">Contributions</th>
                        <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      <tr>
                        <td className="p-4 text-white">Ethan Carter</td>
                        <td className="p-4 text-gray-400">Computer Science</td>
                        <td className="p-4 text-gray-400">1,200</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Pencil size={20} />
                            </button>
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-white">Olivia Chen</td>
                        <td className="p-4 text-gray-400">Electrical Engineering</td>
                        <td className="p-4 text-gray-400">980</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Pencil size={20} />
                            </button>
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-white">Liam Rodriguez</td>
                        <td className="p-4 text-gray-400">Mechanical Engineering</td>
                        <td className="p-4 text-gray-400">750</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Pencil size={20} />
                            </button>
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Two-column layout for data management and content moderation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data Management */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                      Data Management
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 rounded-md border border-gray-800 bg-gray-950 p-6">
                    <h3 className="text-white text-lg font-bold leading-normal">Import Data</h3>
                    <p className="text-sm text-gray-400">Upload a CSV or Excel file to add or update user and department data.</p>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors" htmlFor="dropzone-file">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg aria-hidden="true" className="w-8 h-8 mb-2 text-gray-500" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
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

                {/* Content Moderation */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                    Content Moderation
                  </h2>
                  <div className="flex flex-col gap-4 rounded-md border border-gray-800 bg-gray-950 p-4">
                    <ContentModerationItem
                      title="Inappropriate language in project 'WebApp'"
                      reportedBy="@jane_doe"
                      timeAgo="2 hours ago"
                    />
                    <ContentModerationItem
                      title="Spam commits in 'Data-Structures' repo"
                      reportedBy="@john_smith"
                      timeAgo="1 day ago"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function ContentModerationItem({
  title,
  reportedBy,
  timeAgo
}: {
  title: string
  reportedBy: string
  timeAgo: string
}) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-white">{title}</p>
        <p className="text-sm text-gray-500">
          Reported by {reportedBy} {timeAgo}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors">
          <X size={20} />
        </button>
        <button className="flex items-center justify-center size-8 rounded-md hover:bg-gray-800 text-gray-400 hover:text-green-400 transition-colors">
          <Check size={20} />
        </button>
      </div>
    </div>
  )
}
