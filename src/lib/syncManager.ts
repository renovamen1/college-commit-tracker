import { EventEmitter } from 'events'

// Types for sync management
export interface SyncJob {
  id: string
  type: 'batch' | 'individual'
  status: SyncStatus
  progress: {
    total: number
    processed: number
    successful: number
    failed: number
    percentage: number
  }
  currentTask: string
  startTime: Date
  estimatedEndTime: Date
  studentQueues: Map<string, StudentSyncStatus>
  errors: Array<{ studentId: string; githubUsername: string; error: string }>
  canCancel: boolean
}

export interface StudentSyncStatus {
  id: string
  githubUsername: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  repositoryCount?: number
  commitProgress?: { processed: number; total: number }
  error?: string
  startTime?: Date
  endTime?: Date
}

export type SyncStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelling' | 'cancelled'

// Event types for real-time updates
export interface SyncEvents {
  jobCreated: (job: SyncJob) => void
  jobUpdated: (job: SyncJob) => void
  jobCompleted: (job: SyncJob) => void
  jobCancelled: (job: SyncJob) => void
  jobFailed: (job: SyncJob) => void
  studentUpdated: (studentId: string, status: StudentSyncStatus) => void
  progressUpdate: (progress: { percentage: number; currentTask: string; estimatedMinutes: number }) => void
}

// Singleton sync manager class
class SyncManager extends EventEmitter {
  private currentJob: SyncJob | null = null
  private jobQueue: SyncJob[] = []
  private isProcessing = false
  private cancelRequested = false

  constructor() {
    super()
    // Enable multiple listeners for dashboard usage
    this.setMaxListeners(20)
  }

  // Calculate estimated completion time based on current progress
  private calculateEstimatedTime(progress: SyncJob['progress'], startTime: Date): Date {
    if (progress.percentage === 0) return new Date()

    const elapsed = Date.now() - startTime.getTime()
    const remainingPercentage = 100 - progress.percentage
    const estimatedTotal = (elapsed / progress.percentage) * 100
    const remaining = estimatedTotal * (remainingPercentage / 100)

    return new Date(Date.now() + remaining)
  }

  // Create a new sync job
  createJob(type: 'batch' | 'individual', studentIds: string[] = []): SyncJob {
    const jobId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const job: SyncJob = {
      id: jobId,
      type,
      status: 'queued',
      progress: {
        total: studentIds.length,
        processed: 0,
        successful: 0,
        failed: 0,
        percentage: 0
      },
      currentTask: 'Initializing sync...',
      startTime: new Date(),
      estimatedEndTime: new Date(),
      studentQueues: new Map(),
      errors: [],
      canCancel: true
    }

    // Initialize student status
    studentIds.forEach(id => {
      job.studentQueues.set(id, {
        id,
        githubUsername: '',
        name: '',
        status: 'pending'
      })
    })

    return job
  }

  // Start a batch sync job
  async startBatchSync(studentIds: string[]): Promise<string> {
    if (studentIds.length === 0) {
      throw new Error('No students provided for sync')
    }

    const job = this.createJob('batch', studentIds)

    // Add to queue or start immediately
    if (this.isProcessing) {
      this.jobQueue.push(job)
      this.emit('jobCreated', job)
    } else {
      this.currentJob = job
      this.isProcessing = true
      this.emit('jobCreated', job)
      this.startProcessing(job)
    }

    return job.id
  }

  // Start individual student sync
  async startIndividualSync(studentId: string): Promise<string> {
    const job = this.createJob('individual', [studentId])

    if (this.isProcessing) {
      this.jobQueue.push(job)
      this.emit('jobCreated', job)
    } else {
      this.currentJob = job
      this.isProcessing = true
      this.emit('jobCreated', job)
      this.startProcessing(job)
    }

    return job.id
  }

  // Main processing loop
  private async startProcessing(job: SyncJob): Promise<void> {
    try {
      job.status = 'running'
      job.startTime = new Date()
      job.estimatedEndTime = this.calculateEstimatedTime(job.progress, job.startTime)

      this.emit('jobUpdated', job)

      // Process each student sequentially
      const studentEntries = Array.from(job.studentQueues.entries())

      for (let i = 0; i < Math.min(studentEntries.length, job.progress.total); i++) {
        if (this.cancelRequested) {
          break
        }

        const [studentId, studentStatus] = studentEntries[i]
        if (this.cancelRequested) {
          break
        }

        studentStatus.status = 'processing'
        studentStatus.startTime = new Date()
        job.currentTask = `Syncing @${studentStatus.githubUsername}...`
        job.estimatedEndTime = this.calculateEstimatedTime(job.progress, job.startTime)
        this.emit('studentUpdated', studentId, studentStatus)
        this.emit('progressUpdate', {
          percentage: job.progress.percentage,
          currentTask: job.currentTask,
          estimatedMinutes: Math.ceil((job.estimatedEndTime.getTime() - Date.now()) / (1000 * 60))
        })

        try {
          // Call the actual sync API
          const response = await fetch('/api/sync/student/' + studentId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP ${response.status}`)
          }

          const result = await response.json()

          // Success
          studentStatus.status = 'completed'
          studentStatus.endTime = new Date()
          job.progress.successful++
          job.progress.processed++

          this.emit('studentUpdated', studentId, studentStatus)

        } catch (error) {
          // Error handling
          studentStatus.status = 'failed'
          studentStatus.error = error instanceof Error ? error.message : 'Unknown error'
          studentStatus.endTime = new Date()
          job.progress.failed++
          job.progress.processed++
          job.errors.push({
            studentId,
            githubUsername: studentStatus.githubUsername,
            error: studentStatus.error
          })

          this.emit('studentUpdated', studentId, studentStatus)

          console.error(`Failed to sync @${studentStatus.githubUsername}:`, error)
        }

        // Update overall progress
        job.progress.percentage = Math.floor((job.progress.processed / job.progress.total) * 100)
        job.estimatedEndTime = this.calculateEstimatedTime(job.progress, job.startTime)
        this.emit('jobUpdated', job)

        // Small delay between students to be respectful to GitHub API
        if (!this.cancelRequested && studentId !== Array.from(job.studentQueues.keys()).pop()) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }

      // Complete the job
      if (this.cancelRequested) {
        job.status = 'cancelled'
        job.canCancel = false
        job.currentTask = 'Sync cancelled'
        this.cancelRequested = false
        this.emit('jobCancelled', job)
      } else {
        job.status = job.progress.successful > 0 ? 'completed' : 'failed'
        job.currentTask = job.progress.successful === job.progress.total
          ? 'All students synced successfully!'
          : `${job.progress.successful} synced, ${job.progress.failed} failed`
        job.canCancel = false
        this.emit('jobCompleted', job)
      }

      this.emit('jobUpdated', job)

    } catch (error) {
      console.error('Sync processing failed:', error)
      job.status = 'failed'
      job.canCancel = false
      job.currentTask = 'Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      this.emit('jobFailed', job)
    }

    // Clean up and start next job
    this.isProcessing = false
    this.currentJob = null

    // Process next job in queue
    if (this.jobQueue.length > 0) {
      const nextJob = this.jobQueue.shift()!
      this.currentJob = nextJob
      this.isProcessing = true
      this.startProcessing(nextJob)
    }
  }

  // Cancel current sync job
  cancelCurrentJob(): boolean {
    if (!this.currentJob || this.currentJob.status !== 'running') {
      return false
    }

    if (this.currentJob.canCancel) {
      this.cancelRequested = true
      this.currentJob.currentTask = 'Cancelling sync...'
      this.emit('jobUpdated', this.currentJob)
      return true
    }

    return false
  }

  // Get current job status
  getCurrentJob(): SyncJob | null {
    return this.currentJob
  }

  // Get job by ID
  getJob(jobId: string): SyncJob | null {
    if (this.currentJob?.id === jobId) return this.currentJob

    const queuedJob = this.jobQueue.find(job => job.id === jobId)
    if (queuedJob) return queuedJob

    return null
  }

  // Update student information (name, githubUsername)
  updateStudentInfo(studentId: string, name: string, githubUsername: string): void {
    if (this.currentJob?.studentQueues.has(studentId)) {
      const status = this.currentJob.studentQueues.get(studentId)!
      status.name = name
      status.githubUsername = githubUsername
      this.emit('studentUpdated', studentId, status)
    }

    // Update in queued jobs too
    this.jobQueue.forEach(job => {
      if (job.studentQueues.has(studentId)) {
        const status = job.studentQueues.get(studentId)!
        status.name = name
        status.githubUsername = githubUsername
      }
    })
  }

  // Get all active and queued jobs
  getAllJobs(): SyncJob[] {
    const allJobs = this.jobQueue.slice()
    if (this.currentJob) {
      allJobs.unshift(this.currentJob)
    }
    return allJobs
  }

  // Check if sync is currently running
  isSyncRunning(): boolean {
    return this.isProcessing && !this.cancelRequested
  }

  // Check if can start new sync
  canStartSync(): boolean {
    return !this.isProcessing || this.jobQueue.length < 10 // Max 10 queued jobs
  }

  // Get sync statistics
  getStats() {
    const totalJobs = this.getAllJobs().length
    const runningJobs = this.getAllJobs().filter(job => job.status === 'running').length
    const queuedJobs = this.jobQueue.length
    const completedJobs = this.getAllJobs().filter(job => job.status === 'completed').length
    const failedJobs = this.getAllJobs().filter(job => job.status === 'failed').length

    return {
      totalJobs,
      runningJobs,
      queuedJobs,
      completedJobs,
      failedJobs,
      isProcessing: this.isProcessing
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager()

// Utility functions
export function formatTimeRemaining(estimatedMinutes: number): string {
  if (estimatedMinutes < 1) return 'Less than a minute'
  if (estimatedMinutes === 1) return 'About 1 minute'
  if (estimatedMinutes < 60) return `About ${estimatedMinutes} minutes`

  const hours = Math.floor(estimatedMinutes / 60)
  const minutes = estimatedMinutes % 60

  if (hours === 1 && minutes === 0) return 'About 1 hour'
  if (hours === 1) return `About 1 hour ${minutes} minutes`
  if (minutes === 0) return `About ${hours} hours`

  return `About ${hours} hours ${minutes} minutes`
}

export function calculateSortRate(totalCommits: number, syncTime: number): string {
  const commitsPerMinute = Math.floor((totalCommits / syncTime) * 60)
  if (commitsPerMinute >= 1000) {
    return `${Math.floor(commitsPerMinute / 1000)}K commits/min`
  }
  return commitsPerMinute >= 1 ? `${commitsPerMinute} commits/min` : '< 1 commit/min'
}
