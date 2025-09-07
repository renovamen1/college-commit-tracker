'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="flex h-full flex-1 flex-col">
        <header className="flex w-full items-center justify-between border-b border-b-gray-700/50 bg-[#111827] px-8 py-4">
          <div className="flex items-center gap-2 text-white">
            <svg className="h-8 w-8 text-[#1173d4]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM6 10a1 1 0 01-1.898-.634l2-6a1 1 0 111.898.634l-2 6z" fillRule="evenodd"></path>
            </svg>
            <span className="text-xl font-bold">CommitTracker</span>
          </div>
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 bg-[#1173d4] text-white rounded-md hover:bg-blue-600 transition-colors">
            <span>Back to Dashboard</span>
          </Link>
        </header>
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Departments</h1>
              <p className="text-gray-400">View and manage academic departments.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1173d4] text-white rounded-md hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined">add</span>
              <span>Add New Department</span>
            </button>
          </div>
          <div className="mb-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#1173d4]"
                placeholder="Search departments by name"
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
                  <th className="px-6 py-3" scope="col">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Department Name</span>
                      <span className="material-symbols-outlined text-sm">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-3" scope="col">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Number of Classes</span>
                      <span className="material-symbols-outlined text-sm">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                <tr className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-white">Computer Science</td>
                  <td className="px-6 py-4 whitespace-nowrap">25</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-[#1173d4] hover:text-blue-500">Edit Department</button>
                    <button className="text-red-500 hover:text-red-400">Delete Department</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-white">Electrical Engineering</td>
                  <td className="px-6 py-4 whitespace-nowrap">18</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-[#1173d4] hover:text-blue-500">Edit Department</button>
                    <button className="text-red-500 hover:text-red-400">Delete Department</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-white">Mathematics</td>
                  <td className="px-6 py-4 whitespace-nowrap">32</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-[#1173d4] hover:text-blue-500">Edit Department</button>
                    <button className="text-red-500 hover:text-red-400">Delete Department</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-white">Physics</td>
                  <td className="px-6 py-4 whitespace-nowrap">15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-[#1173d4] hover:text-blue-500">Edit Department</button>
                    <button className="text-red-500 hover:text-red-400">Delete Department</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-white">Business Administration</td>
                  <td className="px-6 py-4 whitespace-nowrap">41</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-[#1173d4] hover:text-blue-500">Edit Department</button>
                    <button className="text-red-500 hover:text-red-400">Delete Department</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-[#1173d4] text-white rounded-md hover:bg-blue-600 transition-colors font-semibold">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
