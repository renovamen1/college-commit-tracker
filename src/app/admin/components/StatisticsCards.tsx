import { Suspense } from 'react'
import { StatsCardSkeleton } from './LoadingSkeleton'
import { Users, Building2, GitBranch, Clock } from 'lucide-react'

interface StatsData {
  totalStudents: number
  totalClasses: number
  totalCommits: number
  lastSyncDate: Date | null
}

async function getStats(): Promise<StatsData> {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/admin/stats`, {
    cache: 'no-store' // Always fetch fresh data
  })

  if (!res.ok) {
    throw new Error('Failed to fetch statistics')
  }

  return res.json()
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function formatLastSync(date: any): string {
  if (!date) return 'Never'

  try {
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Never'

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return dateObj.toLocaleDateString()
  } catch (error) {
    console.warn('Error formatting date:', error, date)
    return 'Never'
  }
}

async function StatisticsCardsServer() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Total Students',
      value: formatNumber(stats.totalStudents),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Classes',
      value: formatNumber(stats.totalClasses),
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Commits Tracked',
      value: formatNumber(stats.totalCommits),
      icon: GitBranch,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Last Sync',
      value: formatLastSync(stats.lastSyncDate || new Date()),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StatisticsCards() {
  return (
    <Suspense fallback={<StatsCardSkeleton />}>
      <StatisticsCardsServer />
    </Suspense>
  )
}
