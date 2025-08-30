'use client'

import { useState, useEffect, Suspense } from 'react'
import { syncManager, SyncJob, formatTimeRemaining, StudentSyncStatus } from '@/lib/syncManager'
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock, Play, Square } from 'lucide-react'

interface SyncProgressProps {
  jobId?: string
  onComplete?: (job: SyncJob) => void
  onCancel?: () => void
  showControls?: boolean
  compact?: boolean
}

function SyncProgressContent({ jobId, onComplete, onCancel, showControls = true, compact = false }: SyncProgressProps) {
  const [currentJob, setCurrentJob] = useState<SyncJob | null>(null)
  const [studentStatuses, setStudentStatuses] = useState<Map<string, StudentSyncStatus>>(new Map())
  const [isCancelling, setIsCancelling] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let mounted = true

    // Get initial job state
    const job = jobId
      ? syncManager.getJob(jobId)
      : syncManager.getCurrentJob()

    if (job && mounted) {
      setCurrentJob(job)
      // Initialize student statuses
      const statusMap = new Map<string, StudentSyncStatus>()
      Array.from(job.studentQueues.entries()).forEach(([id, status]) => {
        statusMap.set(id, status)
      })
      setStudentStatuses(statusMap)
    }

    // Set up event listeners
    function handleJobUpdate(job: SyncJob) {
      if (!mounted) return
      if (!jobId || job.id === jobId) {
        setCurrentJob({ ...job })
        setRefreshKey(prev => prev + 1)
      }
    }

    function handleJobComplete(job: SyncJob) {
      if (!mounted) return
      if (!jobId || job.id === jobId) {
        setCurrentJob({ ...job })
        setIsCancelling(false)
        onComplete?.(job)
      }
    }

    function handleJobCancelled(job: SyncJob) {
      if (!mounted) return
      if (!jobId || job.id === jobId) {
        setCurrentJob({ ...job })
        setIsCancelling(false)
        onCancel?.()
      }
    }

    function handleStudentUpdate(studentId: string, status: StudentSyncStatus) {
      if (!mounted) return
      setStudentStatuses(prev => {
        const newMap = new Map(prev)
        newMap.set(studentId, { ...status })
        return newMap
      })
    }

    // Bind events
    syncManager.on('jobUpdated', handleJobUpdate)
    syncManager.on('jobCompleted', handleJobComplete)
    syncManager.on('jobCancelled', handleJobCancelled)
    syncManager.on('studentUpdated', handleStudentUpdate)

    // Cleanup on unmount
    return () => {
      mounted = false
      syncManager.removeListener('jobUpdated', handleJobUpdate)
      syncManager.removeListener('jobCompleted', handleJobComplete)
      syncManager.removeListener('jobCancelled', handleJobCancelled)
      syncManager.removeListener('studentUpdated', handleStudentUpdate)
    }
  }, [jobId, onComplete, onCancel])

  const handleCancel = () => {
    setIsCancelling(true)
    const success = syncManager.cancelCurrentJob()
    if (!success) {
      setIsCancelling(false)
    }
  }

  if (!currentJob) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No sync job running</div>
        {showControls && (
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
          >
            Refresh Status
          </button>
        )}
      </div>
    )
  }

  const progress = currentJob.progress
  const isRunning = currentJob.status === 'running'
  const isCancelled = currentJob.status === 'cancelled'
  const isCompleted = currentJob.status === 'completed'
  const isFailed = currentJob.status === 'failed'

  const statusColor = isCompleted ? 'text-green-600' :
                      isFailed ? 'text-red-600' :
                      isCancelled ? 'text-gray-600' :
                      'text-blue-600'

  const statusBg = isCompleted ? 'bg-green-50 border-green-200' :
                 isFailed ? 'bg-red-50 border-red-200' :
                 isCancelled ? 'bg-gray-50 border-gray-200' :
                 'bg-blue-50 border-blue-200'

  if (compact) {
    return (
      <div className={`${statusBg} rounded-lg border p-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isRunning && !isCancelling ? (
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : isFailed ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isCancelled ? (
              <XCircle className="h-4 w-4 text-gray-500" />
            ) : (
              <Clock className="h-4 w-4 text-gray-500" />
            )}
            <span className={`text-sm font-medium ${statusColor}`}>
              {isCancelling ? 'Cancelling...' : currentJob.currentTask}
            </span>
          </div>
          {isRunning && showControls && (
            <button
              onClick={handleCancel}
              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCancelling}
            >
              Cancel
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded h-2 mb-2">
          <div
            className="bg-blue-500 h-2 rounded transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600">
          {progress.processed} of {progress.total} students processed
          {progress.successful > 0 && (
            <span className="ml-2 text-green-600">✓ {progress.successful} successful</span>
          )}
          {progress.failed > 0 && (
            <span className="ml-2 text-red-600">✗ {progress.failed} failed</span>
          )}
        </div>
      </div>
    )
  }

  // Full detailed view
  return (
    <div className={`${statusBg} rounded-lg border p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isRunning && !isCancelling ? (
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : isFailed ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : isCancelled ? (
            <XCircle className="h-6 w-6 text-gray-500" />
          ) : (
            <Clock className="h-6 w-6 text-gray-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentJob.type === 'batch' ? 'Batch Sync' : 'Individual Sync'}
            </h3>
            <p className={`text-sm font-medium ${statusColor}`}>
              {isCancelling ? 'Cancelling sync...' : currentJob.currentTask}
            </p>
          </div>
        </div>
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            {isRunning && (
              <button
                onClick={handleCancel}
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Sync'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {progress.percentage.toFixed(0)}% ({progress.processed}/{progress.total})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="bg-blue-500 h-3 rounded transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{progress.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{progress.successful}</div>
          <div className="text-xs text-gray-600">Successful</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
          <div className="text-xs text-gray-600">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {formatTimeRemaining(Math.ceil((currentJob.estimatedEndTime.getTime() - Date.now()) / (1000 * 60)))}
          </div>
          <div className="text-xs text-gray-600">ETA</div>
        </div>
      </div>

      {/* Student List */}
      {studentStatuses.size > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Students</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {Array.from(studentStatuses.values()).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-2">
                  {student.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                  {student.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                  {student.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-500" />}
                  {student.status === 'pending' && <Clock className="h-3 w-3 text-gray-400" />}
                  <span className="text-xs text-gray-900">
                    @{student.githubUsername}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {student.status === 'processing' && 'Processing...'}
                  {student.status === 'completed' && 'Success'}
                  {student.status === 'failed' && (student.error?.substring(0, 15) + '...')}
                  {student.status === 'pending' && 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {currentJob.errors.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Errors ({currentJob.errors.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {currentJob.errors.slice(0, 5).map((error, index) => (
              <div key={index} className="text-xs bg-red-50 border-l-2 border-red-200 p-2">
                <div className="font-medium text-red-800">@{error.githubUsername}</div>
                <div className="text-red-700">{error.error}</div>
              </div>
            ))}
            {currentJob.errors.length > 5 && (
              <div className="text-xs text-gray-500 text-center py-1">
                ... and {currentJob.errors.length - 5} more errors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job Info */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">Started:</span> {currentJob.startTime.toLocaleString()}
          </div>
          {isCompleted && (
            <div>
              <span className="font-medium">Duration:</span> {Math.ceil((Date.now() - currentJob.startTime.getTime()) / 1000)}s
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SyncProgress(props: SyncProgressProps) {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 rounded-lg border p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
        <div className="text-gray-600">Loading sync status...</div>
      </div>
    }>
      <SyncProgressContent {...props} />
    </Suspense>
  )
}
