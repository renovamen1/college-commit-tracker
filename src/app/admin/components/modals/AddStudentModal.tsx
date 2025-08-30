'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, User, Mail, Github, Building, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react'
import { validateGitHubUsername, getUserTotalCommits } from '@/lib/github'


interface Class {
  id: string
  name: string
  department: string
}

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onStudentAdded: () => void
}

// Custom debounce utility function
function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout
  const debouncedFunc = function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
  debouncedFunc.cancel = () => clearTimeout(timeoutId)
  return debouncedFunc
}

// Department options - can be expanded as needed
const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry'
] as const

type ValidationResult = 'blank' | 'validating' | 'valid' | 'invalid' | 'duplicate'
type SubmissionStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error'

export default function AddStudentModal({
  isOpen,
  onClose,
  onStudentAdded,
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    githubUsername: '',
    name: '',
    email: '',
    classId: ''
  })

  const [validationStatus, setValidationStatus] = useState<{
    [key: string]: ValidationResult
  }>({
    githubUsername: 'blank',
    name: 'blank',
    email: 'blank',
    classId: 'blank'
  })

  const [validationMessages, setValidationMessages] = useState<{
    [key: string]: string
  }>({})

  const [classes, setClasses] = useState<Class[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [showSuccess, setShowSuccess] = useState(false)

  // Debounced GitHub validation
  const debouncedValidateGitHub = useCallback(
    debounce(async (username: string) => {
      if (!username.trim()) {
        setValidationStatus(prev => ({ ...prev, githubUsername: 'blank' }))
        setValidationMessages(prev => ({ ...prev, githubUsername: '' }))
        return
      }

      setValidationStatus(prev => ({ ...prev, githubUsername: 'validating' }))

      try {
        // First check for duplicate in database
        const duplicateRes = await fetch(`/api/admin/users?githubUsername=${username}`)
        if (duplicateRes.ok) {
          const duplicateData = await duplicateRes.json()
          if (duplicateData.exists) {
            setValidationStatus(prev => ({ ...prev, githubUsername: 'duplicate' }))
            setValidationMessages(prev => ({
              ...prev,
              githubUsername: 'This GitHub username is already registered'
            }))
            return
          }
        }

        // Then check if GitHub user exists
        const isValidGitHub = await validateGitHubUsername(username)
        if (isValidGitHub) {
          setValidationStatus(prev => ({ ...prev, githubUsername: 'valid' }))
          setValidationMessages(prev => ({ ...prev, githubUsername: 'Valid GitHub username' }))
        } else {
          setValidationStatus(prev => ({ ...prev, githubUsername: 'invalid' }))
          setValidationMessages(prev => ({
            ...prev,
            githubUsername: 'GitHub user not found'
          }))
        }
      } catch (error) {
        setValidationStatus(prev => ({ ...prev, githubUsername: 'invalid' }))
        setValidationMessages(prev => ({
          ...prev,
          githubUsername: 'Failed to validate GitHub username'
        }))
      }
    }, 500),
    []
  )

  useEffect(() => {
    if (isOpen) {
      loadClasses()
    }
  }, [isOpen])

  useEffect(() => {
    // Cleanup debounced function on unmount
    return () => {
      debouncedValidateGitHub.cancel()
    }
  }, [debouncedValidateGitHub])

  const loadClasses = async () => {
    try {
      const res = await fetch('/api/admin/classes?limit=50')
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Validate name (required, min 2 characters)
    if (field === 'name') {
      if (!value.trim()) {
        setValidationStatus(prev => ({ ...prev, name: 'blank' }))
        setValidationMessages(prev => ({ ...prev, name: '' }))
      } else if (value.length < 2) {
        setValidationStatus(prev => ({ ...prev, name: 'invalid' }))
        setValidationMessages(prev => ({ ...prev, name: 'Name must be at least 2 characters' }))
      } else {
        setValidationStatus(prev => ({ ...prev, name: 'valid' }))
        setValidationMessages(prev => ({ ...prev, name: '' }))
      }
    }

    // Validate email
    if (field === 'email') {
      if (!value.trim()) {
        setValidationStatus(prev => ({ ...prev, email: 'blank' }))
        setValidationMessages(prev => ({ ...prev, email: '' }))
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setValidationStatus(prev => ({ ...prev, email: 'invalid' }))
        setValidationMessages(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      } else {
        setValidationStatus(prev => ({ ...prev, email: 'valid' }))
        setValidationMessages(prev => ({ ...prev, email: '' }))
      }
    }

    // Trigger GitHub validation
    if (field === 'githubUsername') {
      debouncedValidateGitHub(value)
    }

    // Class is optional, so always valid
    if (field === 'classId') {
      setValidationStatus(prev => ({ ...prev, classId: 'valid' }))
      setValidationMessages(prev => ({ ...prev, classId: '' }))
    }
  }

  const getValidationIcon = (field: string) => {
    const status = validationStatus[field]

    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'invalid':
      case 'duplicate':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'validating':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getInputBorderColor = (field: string) => {
    const status = validationStatus[field]

    switch (status) {
      case 'valid':
        return 'border-green-500 focus:border-green-500 focus:ring-green-500'
      case 'invalid':
      case 'duplicate':
        return 'border-red-500 focus:border-red-500 focus:ring-red-500'
      case 'validating':
        return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
  }

  const canSubmit = () => {
    return (
      validationStatus.githubUsername === 'valid' &&
      validationStatus.name === 'valid' &&
      (formData.email === '' || validationStatus.email === 'valid') &&
      submissionStatus !== 'submitting'
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus('validating')

    // Final validation
    if (!canSubmit()) {
      setSubmissionStatus('error')
      setTimeout(() => setSubmissionStatus('idle'), 2000)
      return
    }

    setSubmissionStatus('submitting')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific errors
        if (response.status === 409) {
          setValidationStatus(prev => ({ ...prev, githubUsername: 'duplicate' }))
          setValidationMessages(prev => ({
            ...prev,
            githubUsername: 'This GitHub username is already registered'
          }))
          setSubmissionStatus('error')
          return
        }
        throw new Error(data.error || 'Failed to add student')
      }

      setSubmissionStatus('success')
      setShowSuccess(true)

      // Reset form and close modal after delay
      setTimeout(() => {
        resetForm()
        onStudentAdded()
        onClose()
        setShowSuccess(false)
      }, 2000)

    } catch (error) {
      console.error('Error adding student:', error)
      setSubmissionStatus('error')
      setValidationMessages(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to add student'
      }))
    }
  }

  const resetForm = () => {
    setFormData({ githubUsername: '', name: '', email: '', classId: '' })
    setValidationStatus({
      githubUsername: 'blank',
      name: 'blank',
      email: 'blank',
      classId: 'blank'
    })
    setValidationMessages({})
    setSubmissionStatus('idle')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-500" />
                Add New Student
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                disabled={submissionStatus === 'submitting'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showSuccess && submissionStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Student Added Successfully!</h4>
                <p className="text-sm text-gray-600">
                  @{formData.githubUsername} has been added to the system and is ready for GitHub tracking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* GitHub Username */}
                <div>
                  <label htmlFor="githubUsername" className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Username *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="githubUsername"
                      value={formData.githubUsername}
                      onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                      className={`block w-full pl-11 pr-10 py-3 border ${getInputBorderColor('githubUsername')} rounded-lg focus:outline-none focus:ring-2`}
                      placeholder="e.g., johndoe"
                      required
                      disabled={submissionStatus === 'submitting'}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {getValidationIcon('githubUsername')}
                    </div>
                  </div>
                  {validationMessages.githubUsername && (
                    <p className={`text-sm mt-2 ${
                      validationStatus.githubUsername === 'valid'
                        ? 'text-green-600'
                        : validationStatus.githubUsername === 'duplicate'
                          ? 'text-orange-600'
                          : 'text-red-600'
                    }`}>
                      {validationMessages.githubUsername}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`block w-full pl-11 pr-3 py-3 border ${getInputBorderColor('name')} rounded-lg focus:outline-none focus:ring-2`}
                      placeholder="e.g., John Doe"
                      required
                      disabled={submissionStatus === 'submitting'}
                    />
                  </div>
                  {validationMessages.name && (
                    <p className="text-red-600 text-sm mt-2">
                      {validationMessages.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`block w-full pl-11 pr-3 py-3 border ${getInputBorderColor('email')} rounded-lg focus:outline-none focus:ring-2`}
                      placeholder="e.g., john@example.com"
                      disabled={submissionStatus === 'submitting'}
                    />
                  </div>
                  {validationMessages.email && (
                    <p className="text-red-600 text-sm mt-2">
                      {validationMessages.email}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Optional: Valid email format required if provided</p>
                </div>

                {/* Class Selection */}
                <div>
                  <label htmlFor="classId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Class
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="classId"
                      value={formData.classId}
                      onChange={(e) => handleInputChange('classId', e.target.value)}
                      className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={submissionStatus === 'submitting'}
                    >
                      <option value="">Select a class (optional)...</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Optional: Students can be assigned to classes later</p>
                </div>

                {/* Submit Error */}
                {submissionStatus === 'error' && validationMessages.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {validationMessages.submit}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={submissionStatus === 'submitting'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center"
                  >
                    {submissionStatus === 'submitting' ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Adding Student...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Add Student
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
