'use client'

import { Logo } from '@/components/ui/Logo'

'use client'

export default function AdminLoginPage() {
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
          <div className="flex flex-col gap-6 rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-gray-950/50">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="username">
                Username or Email
              </label>
              <input
                className="block w-full rounded-md border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)]"
                id="username"
                placeholder="admin@university.edu"
                type="text"
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
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-gray-400" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a className="font-medium text-[var(--primary-color)] hover:text-blue-500" href="#">
                  Forgot your password?
                </a>
              </div>
            </div>
            <button
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[var(--primary-color)] px-6 py-3 text-base font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-950"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                // Simulate admin login - in real app, verify credentials
                if (typeof window !== 'undefined') {
                  window.location.href = '/admin'
                }
              }}
            >
              <span className="truncate">Sign In</span>
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            This system is for authorized use only. Unauthorized access is prohibited and may be subject to legal action.
          </p>
        </div>
      </div>
    </div>
  )
}
