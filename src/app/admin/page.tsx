'use client'

import { Suspense, useState } from 'react'
import StatisticsCards from './components/StatisticsCards'
import RecentActivity from './components/RecentActivity'
import QuickActions from './components/QuickActions'
import { AdminDashboardSkeleton } from './components/LoadingSkeleton'

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDataUpdated = () => {
    // Force refresh of all components by updating the trigger
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage students, classes, and track GitHub contributions</p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <Suspense fallback={<AdminDashboardSkeleton />}>
            <StatisticsCards key={`stats-${refreshTrigger}`} />
          </Suspense>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <Suspense fallback={<AdminDashboardSkeleton />}>
              <RecentActivity key={`activity-${refreshTrigger}`} />
            </Suspense>
          </div>

          {/* Quick Actions - Takes 1/3 of the width */}
          <div className="lg:col-span-1">
            <QuickActions onDataUpdated={handleDataUpdated} />
          </div>
        </div>
      </div>
    </div>
  )
}
