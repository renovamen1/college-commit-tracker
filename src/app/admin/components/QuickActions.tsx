'use client'

import { useState } from 'react'
import { UserPlus, Building2, RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react'
import AddStudentModal from './modals/AddStudentModal'
import CreateClassModal from './modals/CreateClassModal'

interface Class {
  id: string
  name: string
  department: string
}

interface QuickActionsProps {
  onDataUpdated: () => void
}

export default function QuickActions({ onDataUpdated }: QuickActionsProps) {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')
  const [classes, setClasses] = useState<Class[]>([])

  // Load classes when modals need them
  const loadClasses = async () => {
    try {
      const res = await fetch('/api/admin/classes?limit=50')
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes.map((cls: any) => ({
          id: cls.id,
          name: cls.name,
          department: cls.department
        })))
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const handleSyncAllStudents = async () => {
    setSyncStatus('syncing')
    setSyncMessage('Syncing all students with GitHub...')

    try {
      // This would be a new API endpoint that syncs all students' GitHub data
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Sync failed')
      }

      const data = await response.json()
      setSyncStatus('success')
      setSyncMessage(`Sync completed! Updated ${data.updatedCount} students.`)
      onDataUpdated()

      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
      }, 3000)

    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(error instanceof Error ? error.message : 'Sync failed')
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
      }, 3000)
    }
  }

  const handleExportData = () => {
    // For now, just show a placeholder - would implement CSV export
    alert('Export functionality would download a CSV file with all student and class data.')
  }

  const handleOpenStudentModal = async () => {
    await loadClasses()
    setIsStudentModalOpen(true)
  }

  const handleStudentAdded = () => {
    onDataUpdated()
  }

  const handleClassCreated = () => {
    onDataUpdated()
    // Refresh classes list for the student modal
    loadClasses()
  }

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Add a student and sync their GitHub data',
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      action: handleOpenStudentModal
    },
    {
      title: 'Create New Class',
      description: 'Set up a new class for student assignment',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      action: () => setIsClassModalOpen(true)
    },
    {
      title: 'Sync All Students',
      description: 'Update commit data for all students',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      action: handleSyncAllStudents
    },
    {
      title: 'Export Data',
      description: 'Download student and class data as CSV',
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      action: handleExportData
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          Quick Actions
        </h2>
      </div>

      {/* Sync Status */}
      {(syncStatus !== 'idle' || syncMessage) && (
        <div className={`mb-6 p-4 rounded-lg border ${
          syncStatus === 'success' ? 'bg-green-50 border-green-200' :
          syncStatus === 'error' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {syncStatus === 'syncing' ? (
                <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
              ) : syncStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                syncStatus === 'success' ? 'text-green-800' :
                syncStatus === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {syncStatus === 'syncing' && 'Sync in Progress'}
                {syncStatus === 'success' && 'Sync Completed'}
                {syncStatus === 'error' && 'Sync Failed'}
              </p>
              <p className={`text-sm mt-1 ${
                syncStatus === 'success' ? 'text-green-700' :
                syncStatus === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {syncMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon
          const isSyncing = action.title === 'Sync All Students' && syncStatus === 'syncing'

          return (
            <button
              key={index}
              onClick={isSyncing ? undefined : action.action}
              disabled={isSyncing}
              className={`w-full ${action.bgColor} ${action.hoverColor} border border-gray-200 rounded-lg p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.bgColor} ${isSyncing ? 'animate-pulse' : ''}`}>
                  {isSyncing ? (
                    <RefreshCw className={`h-5 w-5 animate-spin`} />
                  ) : (
                    <IconComponent className={`h-5 w-5 ${action.color}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </div>
                <div className={`flex-shrink-0 ${action.color}`}>
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* System Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Admin Dashboard - GitHub Commit Tracker</p>
          <p className="mt-1">Real-time tracking and management system</p>
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onStudentAdded={handleStudentAdded}
        classes={classes}
      />

      <CreateClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onClassCreated={handleClassCreated}
      />
    </div>
  )
}
