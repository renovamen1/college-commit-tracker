'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Mock authentication - in real app, this would validate against backend
    if (email && password) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set user as logged in
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)

      // Redirect to home page (main dashboard)
      router.push('/home')
    } else {
      setError('Please fill in all fields')
    }
    setIsLoading(false)
  }

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setEmail('demo@example.com')
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-[#111a22] flex items-center justify-center py-16 px-4" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      {/* Main Login Form */}
      <main className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access your commit tracking dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email-address">
                Username or Email
              </label>
              <input
                autoComplete="email"
                className="relative block w-full appearance-none rounded-md border border-[#324d67] bg-[#192633] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                id="email-address"
                name="email"
                placeholder="Username or Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded-md border border-[#324d67] bg-[#192633] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Demo Credentials Button */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full text-center text-xs text-[#1173d4] hover:text-blue-400 hover:underline"
          >
            Demo: Click here to fill demo credentials
          </button>

          {error && (
            <div className="text-red-400 text-center text-sm bg-red-900/20 border border-red-800 rounded-md p-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-offset-gray-800"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-gray-300" htmlFor="remember-me"> Remember me </label>
            </div>
            <div className="text-sm">
              <a className="font-medium text-[var(--primary-color)] hover:text-blue-500" href="#">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Demo login available above for testing
          </p>
        </form>
      </main>
    </div>
  )
}
