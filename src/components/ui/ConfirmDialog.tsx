'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
        return <AlertTriangle className="w-6 h-6 text-blue-500" />
      default:
        return <AlertTriangle className="w-6 h-6 text-red-500" />
    }
  }

  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger'
      default:
        return 'primary'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-gray-600 text-sm">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="sm:flex-1 max-w-[120px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={onConfirm}
            loading={isLoading}
            loadingText="Deleting..."
            className="sm:flex-1 max-w-[120px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook for easier usage
interface UseConfirmDialogReturn {
  confirm: (props: {
    title: string
    description?: string
    onConfirm: () => void | Promise<void>
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
  }) => void
  Dialog: React.FC
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [dialogProps, setDialogProps] = React.useState<{
    isOpen: boolean
    title: string
    description?: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
  }>({
    isOpen: false,
    title: '',
    onConfirm: () => {}
  })

  const confirm = React.useCallback((props: {
    title: string
    description?: string
    onConfirm: () => void | Promise<void>
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
  }) => {
    const handleConfirm = async () => {
      try {
        setDialogProps(prev => ({ ...prev, isLoading: true }))
        await props.onConfirm()
        setDialogProps(prev => ({ ...prev, isLoading: false, isOpen: false }))
      } catch (error) {
        setDialogProps(prev => ({ ...prev, isLoading: false }))
        // Error will be handled by toast or error boundary
      }
    }

    setDialogProps({
      isOpen: true,
      title: props.title,
      description: props.description,
      onConfirm: handleConfirm,
      confirmText: props.confirmText,
      cancelText: props.cancelText,
      type: props.type,
      isLoading: false
    })
  }, [])

  const onClose = React.useCallback(() => {
    setDialogProps(prev => ({ ...prev, isOpen: false }))
  }, [])

  const Dialog = React.useCallback(() => (
    <ConfirmDialog
      {...dialogProps}
      onClose={onClose}
    />
  ), [dialogProps, onClose])

  return { confirm, Dialog }
}
