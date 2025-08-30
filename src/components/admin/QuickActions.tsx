'use client'

import { useState, ReactNode } from 'react'
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { ElementType } from 'react'

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error'

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: ElementType
  onClick: () => Promise<void> | void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

interface QuickActionsProps {
  title?: string
  actions: QuickAction[]
  className?: string
}

interface ActionButtonProps extends QuickAction {
  status: ActionStatus
  onStatusChange: (status: ActionStatus, message?: string) => void
}

function ActionButton({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'primary',
  disabled = false,
  status,
  onStatusChange
}: ActionButtonProps) {
  const isLoading = status === 'loading'
  const hasError = status === 'error'
  const hasSuccess = status === 'success'

  const handleClick = async () => {
    if (isLoading || disabled) return

    try {
      onStatusChange('loading', `Processing ${title.toLowerCase()}...`)

      const result = onClick()
      if (result instanceof Promise) {
        await result
      }

      onStatusChange('success', `${title} completed successfully!`)
    } catch (error) {
      onStatusChange('error', error instanceof Error ? error.message : `Failed to ${title.toLowerCase()}`)
    } finally {
      // Reset status after 3 seconds
      setTimeout(() => {
        onStatusChange('idle')
      }, 3000)
    }
  }

  const baseClasses = "w-full border border-gray-200 rounded-lg p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  const variantClasses = variant === 'primary'
    ? "bg-blue-50 hover:bg-blue-100"
    : "bg-gray-50 hover:bg-gray-100"

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-white relative">
          {isLoading ? (
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          ) : (
            <Icon className="h-5 w-5 text-blue-600" />
          )}
          {hasSuccess && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle className="h-4 w-4 text-green-500 bg-white rounded-full" />
            </div>
          )}
          {hasError && (
            <div className="absolute -top-1 -right-1">
              <AlertCircle className="h-4 w-4 text-red-500 bg-white rounded-full" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${
            hasSuccess ? 'text-green-600' : hasError ? 'text-red-600' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}

function QuickActionsStatus({
  status,
  message,
  actionId
}: {
  status: ActionStatus
  message: string
  actionId?: string
}) {
  if (status === 'idle' || !message) return null

  const bgColor = status === 'success' ? 'bg-green-50' : status === 'error' ? 'bg-red-50' : 'bg-blue-50'
  const borderColor = status === 'success' ? 'border-green-200' : status === 'error' ? 'border-red-200' : 'border-blue-200'
  const Icon = status === 'success' ? CheckCircle : status === 'error' ? AlertCircle : RefreshCw

  return (
    <div className={`mb-6 p-4 rounded-lg border ${bgColor} ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${
            status === 'success' ? 'text-green-400' :
            status === 'error' ? 'text-red-400' :
            'text-blue-400 animate-spin'
          }`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            status === 'success' ? 'text-green-800' :
            status === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {status === 'loading' && 'Processing'}
            {status === 'success' && 'Success'}
            {status === 'error' && 'Error'}
            {actionId && ` - ${actionId}`}
          </p>
          <p className={`text-sm mt-1 ${
            status === 'success' ? 'text-green-700' :
            status === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function QuickActions({
  title = 'Quick Actions',
  actions,
  className = ''
}: QuickActionsProps) {
  const [actionStatuses, setActionStatuses] = useState<Record<string, { status: ActionStatus, message: string }>>(() =>
    Object.fromEntries(actions.map(action => [action.id, { status: 'idle' as ActionStatus, message: '' }]))
  )

  const updateActionStatus = (actionId: string, status: ActionStatus, message = '') => {
    setActionStatuses(prev => ({
      ...prev,
      [actionId]: { status, message }
    }))
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Global status for all actions */}
      {Object.entries(actionStatuses).map(([actionId, { status, message }]) => (
        <QuickActionsStatus
          key={actionId}
          status={status}
          message={message}
          actionId={actionId}
        />
      ))}

      {/* Action Buttons */}
      <div className="space-y-4">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            {...action}
            status={actionStatuses[action.id]?.status || 'idle'}
            onStatusChange={(status, message) => updateActionStatus(action.id, status, message)}
          />
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Admin Dashboard - GitHub Commit Tracker
          <br />
          Real-time tracking and management system
        </div>
      </div>
    </div>
  )
}

// QuickAction interface is already exported where defined
// QuickActionsProps interface is already exported where defined
