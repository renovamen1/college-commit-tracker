import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          College Commit Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track and analyze GitHub commits from college students and institutions
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Student Dashboard</h3>
            <p className="text-gray-600 mb-4">
              View your commit history and track your progress
            </p>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Repository Analysis</h3>
            <p className="text-gray-600 mb-4">
              Analyze repositories and track contributions
            </p>
            <Link
              href="/analytics"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Analytics
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
            <p className="text-gray-600 mb-4">
              Manage users and system settings
            </p>
            <Link
              href="/admin"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
