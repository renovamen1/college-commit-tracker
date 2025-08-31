'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error info:', errorInfo)

    // Here you could also send the error to an error reporting service
    // Example: reportError(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-700 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="
                  inline-flex items-center justify-center px-4 py-2
                  bg-blue-600 text-white rounded-lg hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleRefresh}
                className="
                  inline-flex items-center justify-center px-4 py-2
                  bg-gray-600 text-white rounded-lg hover:bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for error reporting (you can extend this for external services)
export const reportError = (error: Error, errorInfo: ErrorInfo) => {
  // Example: Send to error reporting service
  console.log('Reporting error to service:', { error, errorInfo })

  // Uncomment and configure for your error reporting service:
  // Sentry.captureException(error, { extra: errorInfo })
  // Bugsnag.notify(error, { metadata: errorInfo })
  // Raygun.send(error, { customData: errorInfo })
}

// Simple error fallback component for specific use cases
interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  className?: string
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  className = ""
}) => (
  <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-red-800">Error</h4>
        <p className="text-red-700 mt-1">{error.message}</p>
        <button
          onClick={resetError}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline focus:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
)

// Function component wrapper with error boundary hook
interface WithErrorBoundaryOptions {
  fallback?: ReactNode
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: WithErrorBoundaryOptions
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={options?.fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
