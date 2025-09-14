'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    // Check cookie on client side (middleware will handle server-side redirects)
    const cookies = document?.cookie?.split(';')
    const adminToken = cookies?.find(cookie => cookie.trim().startsWith('admin_token='))
    if (adminToken && adminToken.split('=')[1] === 'authenticated') {
      // In a real app, you'd verify the token
      router.push('/admin')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user data in localStorage for UI reference
        localStorage.setItem('admin_user', JSON.stringify(data.user))

        // Redirect will be handled automatically by the middleware
        router.push('/admin')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fill remembered credentials from cookies
  useEffect(() => {
    const cookies = document?.cookie?.split(';')
    const adminUser = cookies?.find(cookie => cookie.trim().startsWith('admin_user='))
    const adminRemember = cookies?.find(cookie => cookie.trim().startsWith('admin_remember='))

    if (adminRemember && adminUser) {
      try {
        const userCookie = adminUser.split('=')[1]
        const user = JSON.parse(decodeURIComponent(userCookie))
        setUsername(user.username)
        setRememberMe(true)
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  return (
    <div className="flex size-full min-h-screen flex-col overflow-x-hidden bg-[#111A22]">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0KnE2jd8h3b0pibOe4BArlpWB7LIgOmyO9vBjOLFB6kXPhHvbIV4J7i6PB0wpptddY074exSZivxrA36jGpD9uh7Ed4FWzVhvWi2zSND5WyCWan_jPOk8AXAmGPAwH-6gUxwKwtNTIpoUcEZF0KRGgmIwe2rWA4GPBANO38sxoVTP3AzhNZzgMDf6LQbXpxYbA8KeIX1jl7ZUeR-aa90RRvsx4ft-zec0PKE7vbMM7B16Zq0fJWHndaDabIQp27t2Fd7Yro-1zMA")`
                }}
              ></div>
              <h1 className="text-white text-3xl font-bold leading-normal">CodeCommit</h1>
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Dashboard Login</h2>
            <p className="text-gray-400">Secure access for authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6 rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-gray-950/50">
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="username">
                Username or Email
              </label>
              <input
                className="block w-full rounded-md border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)]"
                id="username"
                placeholder="admin@codecommit.edu"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                className="block w-full rounded-md border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)]"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="ml-2 block text-sm text-gray-400" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-[var(--primary-color)] hover:text-blue-500"
                  onClick={() => alert('Password reset feature coming soon!')}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <button
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[var(--primary-color)] px-6 py-3 text-base font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              <span className="truncate">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="rounded-lg border border-blue-800 bg-blue-900/50 p-4">
              <p className="text-sm font-medium text-blue-300 mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-200">
                Username: <code className="bg-blue-950 px-1 rounded">admin@codecommit.edu</code>
              </p>
              <p className="text-sm text-blue-200">
                Password: <code className="bg-blue-950 px-1 rounded">admin123</code>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            This system is for authorized use only. Unauthorized access is prohibited and may be subject to legal action.
          </p>
        </div>
      </div>
    </div>
  )
}
