'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StudentsList, { StudentsListSkeleton, StudentsListWithSuspense } from '@/components/admin/StudentsList'
import QuickActions from '@/components/admin/QuickActions'
import AddStudentModal from '../components/modals/AddStudentModal'
import { User } from 'lucide-react'

export default function StudentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [deletingStudent, setDeletingStudent] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const searchParams = useSearchParams()
  const currentClass = searchParams.get('class')
  const searchQuery = searchParams.get('search')

  const handleStudentAdded = () => {
    setIsAddModalOpen(false)
    setRefreshKey(prev => prev + 1)
  }

  const handleStudentUpdated = () => {
    setEditingStudent(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleStudentDeleted = () => {
    setDeletingStudent(null)
    setRefreshKey(prev => prev + 1)
  }

  const quickActions = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Add a new student to the system',
      icon: User,
      onClick: () => setIsAddModalOpen(true)
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
          <p className="text-gray-600">Manage college students and their GitHub activity tracking</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            actions={quickActions}
            className="max-w-md"
          />
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow">
          <Suspense fallback={<StudentsListSkeleton />}>
            <StudentsList
              key={refreshKey}
              onStudentSelect={(student) => setEditingStudent(student)}
            />
          </Suspense>
        </div>

        {/* Bulk Actions Panel */}
        <div className="mt-8">
          <BulkActionPanel />
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />

      {editingStudent && (
        <EditStudentModal
          isOpen={!!editingStudent}
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onStudentUpdated={handleStudentUpdated}
        />
      )}

      {deletingStudent && (
        <DeleteConfirmationModal
          isOpen={!!deletingStudent}
          title="Delete Student"
          message={`Are you sure you want to delete ${deletingStudent.name}? This action cannot be undone.`}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleStudentDeleted}
        />
      )}
    </div>
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
