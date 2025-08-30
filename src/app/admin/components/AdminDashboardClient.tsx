'use client'

import { Suspense, useState } from 'react'
import StatisticsCards from './StatisticsCards'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'
import { AdminDashboardSkeleton } from './LoadingSkeleton'

export default function AdminDashboardClient() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDataUpdated = () => {
    // Force refresh of all components by updating the trigger
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
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
    </>
  )
}
