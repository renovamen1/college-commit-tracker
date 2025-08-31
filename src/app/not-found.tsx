'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <div className="text-6xl mb-4">🚀</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Popular pages */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" />
              Popular Pages
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/students"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Manage Students
              </Link>
              <Link
                href="/admin/leaderboard"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Leaderboard
              </Link>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Home
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            fullWidth
            className="justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push('/admin')}
            variant="primary"
            fullWidth
            className="justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
