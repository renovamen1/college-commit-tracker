'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './Logo'

export function SmartHeader() {
  const pathname = usePathname()
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    linkGithub: false,
    role: 'Student',
    password: '',
    confirmPassword: ''
  })

  // Don't show SmartHeader on home pages (HomeLayout handles its own header)
  if (pathname.startsWith('/home') || pathname.startsWith('/admin')) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          githubUsername: formData.githubUsername || null,
          role: formData.role,
          password: formData.password,
          linkGithub: formData.linkGithub
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Please log in.')
        setFormData({
          name: '',
          email: '',
          githubUsername: '',
          linkGithub: false,
          role: 'Student',
          password: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setShowSignupModal(false)
          setSuccess('')
        }, 2000)
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#111a22]/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 text-[var(--text-primary)]">
              <Logo />
              <h1 className="text-xl font-bold tracking-tight">CommitTracker</h1>
            </div>

            {/* Landing Page Navigation */}
            <nav className="flex items-center gap-6">
              <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/home">
                Home
              </a>
              <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/about">
                About
              </a>
              <button
                onClick={() => setShowSignupModal(true)}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors text-sm font-medium px-3 py-1.5 rounded-md hover:bg-[var(--primary-color)]/10"
              >
                Sign Up
              </button>
              <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/login">
                Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Sign Up Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={() => setShowSignupModal(false)}></div>
            </div>

            <div className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-gray-900 border border-gray-800 rounded-md shadow-xl sm:my-8 sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-white text-3xl font-bold leading-tight">Create Your Account</h1>
                  <button
                    onClick={() => setShowSignupModal(false)}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-md">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Full Name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm text-white py-3 px-4"
                        placeholder="e.g. Prabin Thakur"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address *
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm text-white py-3 px-4"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="github-username" className="block text-sm font-medium text-gray-300">
                      GitHub Username (Optional)
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 sm:text-sm">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="githubUsername"
                        id="github-username"
                        value={formData.githubUsername}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md bg-gray-600 border-gray-700 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm text-white"
                        placeholder="your-username"
                      />
                    </div>
                    {formData.githubUsername && (
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          name="linkGithub"
                          id="link-github"
                          checked={formData.linkGithub}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
                        />
                        <label htmlFor="link-github" className="ml-2 block text-sm text-gray-400">
                          Link GitHub account now
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 py-3 pl-3 pr-10 text-base text-white focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                    >
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                      <option value="Instructor">Instructor</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password *
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm text-white py-3 px-4"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                      Confirm Password *
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirm-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="block w-full bg-gray-600 border-gray-700 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm text-white py-3 px-4"
                        placeholder="••••••••"
                      />
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-2 text-xs text-red-500">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowSignupModal(false)}
                      className="flex-1 justify-center rounded-md border border-gray-600 bg-gray-700 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
