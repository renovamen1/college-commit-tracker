'use client'

import { useState } from 'react'
import AddStudentModal from '../components/modals/AddStudentModal'

export default function ClassesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleStudentAdded = () => {
    setIsAddModalOpen(false)
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/admin" className="hover:text-white transition-colors">Dashboard</a>
          <span>/</span>
          <span className="text-white">Classes</span>
        </nav>
        <h2 className="text-white text-4xl font-bold leading-tight tracking-tighter">
          Computer Science 101
        </h2>
        <p className="text-[#92adc9] text-base font-normal leading-normal">
          Detailed view of class activity and contributions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#324d67]">
        <nav className="flex gap-8">
          <button className="flex items-center justify-center border-b-2 border-b-[#1172d4] text-white pb-3 pt-1">
            <p className="text-white text-sm font-semibold leading-normal">Overview</p>
          </button>
          <button className="flex items-center justify-center border-b-2 border-b-transparent text-white/60 hover:text-white transition-colors pb-3 pt-1">
            <p className="text-sm font-semibold leading-normal">Members</p>
          </button>
          <button className="flex items-center justify-center border-b-2 border-b-transparent text-white/60 hover:text-white transition-colors pb-3 pt-1">
            <p className="text-sm font-semibold leading-normal">Repositories</p>
          </button>
        </nav>
      </div>

      {/* Activity Metrics */}
      <section className="mt-8">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">
          Activity Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">1,250</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Active Contributors</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">45</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Repositories</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">12</p>
          </div>
        </div>
      </section>

      {/* Member Contributions Table */}
      <section className="mt-12">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">
          Member Contributions
        </h2>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
              <table className="min-w-full divide-y divide-[#324d67]">
                <thead className="bg-[#192633]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Commits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Ethan Harper</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Olivia Bennett</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">220</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">3 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Noah Carter</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">1 day ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </>
  )
}

// Bulk Actions Component
function BulkActionPanel() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false)

  if (selectedStudents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm text-gray-500 text-center">
          Select students to enable bulk actions
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          {selectedStudents.length} student(s) selected
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsBulkActionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Bulk Sync
          </button>
          <button
            onClick={() => setIsBulkActionModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Assign Class
          </button>
          <button
            onClick={() => setIsBulkActionModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
