import StatisticsCards from './components/StatisticsCards'
import RecentActivity from './components/RecentActivity'
import AdminDashboardClient from './components/AdminDashboardClient'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage students, classes, and track GitHub contributions</p>
        </div>

        {/* Use Client Component for interactive features */}
        <AdminDashboardClient />
      </div>
    </div>
  )
}
