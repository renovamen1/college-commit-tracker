'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
}

// Base skeleton component with shimmer animation
const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{
      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      backgroundSize: '200px 100%',
      animation: 'shimmer 1.5s infinite'
    }}
  />
)

// Skeleton for cards (like stats cards)
export const CardSkeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <Skeleton className="h-4 mb-2 w-1/2" />
    <Skeleton className="h-8 w-3/4" />
  </div>
)

// Skeleton for lists (like activity or student lists)
export const ListSkeleton = ({
  rows = 5,
  className = ""
}: { rows?: number; className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
)

// Skeleton for tables
export const TableSkeleton = ({
  rows = 8,
  columns = 4,
  className = ""
}: { rows?: number; columns?: number; className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex space-x-4 p-3 bg-gray-50 rounded-lg">
        {[...Array(columns)].map((_, j) => (
          <Skeleton key={j} className="flex-1 h-4" />
        ))}
      </div>
    ))}
  </div>
)

// Skeleton for text content
export const TextSkeleton = ({
  lines = 3,
  className = ""
}: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
)

// Skeleton for complete dashboard layout
export const DashboardSkeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse ${className}`}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <Skeleton className="h-6 mb-4 w-1/3" />
        <ListSkeleton rows={6} className="pt-4" />
      </div>

      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
        <Skeleton className="h-6 mb-4 w-1/2" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Loading spinner component
export const LoadingSpinner = ({
  size = 'md',
  className = ""
}: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        className="animate-spin text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Page-level loading overlay
export const PageLoader = ({
  message = "Loading...",
  className = ""
}: { message?: string; className?: string }) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

// Add shimmer animation to global styles
const globalStyles = `
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
`

// Inject styles if in browser
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('shimmer-styles') || document.createElement('style')
  styleElement.id = 'shimmer-styles'
  styleElement.textContent = globalStyles
  document.head.appendChild(styleElement)
}

export { Skeleton }
