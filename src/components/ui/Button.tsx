'use client'

import React from 'react'
import { LoadingSpinner } from './LoadingSkeleton'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
  }

  const combinedClassName = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

  return (
    <button
      {...props}
      className={combinedClassName}
      disabled={disabled || loading}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {loading ? 'Loading...' : children}
    </button>
  )
}

// Loading button component specifically for button with loading states
interface LoadingButtonProps extends ButtonProps {
  loadingText?: string
  successText?: string
  success?: boolean
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loadingText,
  successText,
  success = false,
  loading = false,
  children,
  ...props
}) => {
  if (success) {
    return (
      <Button
        {...props}
        variant="primary"
        className={`bg-green-600 hover:bg-green-700 focus:ring-green-500 ${props.className}`}
      >
        {successText || '✓ Success'}
      </Button>
    )
  }

  return (
    <Button
      {...props}
      loading={loading}
    >
      {loading ? (loadingText || 'Loading...') : children}
    </Button>
  )
}
