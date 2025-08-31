'use client'

export default function HomeProfilePage() {
  // Mock authentication state - replace with real auth later
  const isLoggedIn = false // Set to true for authenticated user

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-white text-3xl font-bold mb-4">
            Personal Stats Locked
          </h2>
          <p className="text-[#92adc9] text-lg mb-8">
            Connect your GitHub account to view your personal statistics, rankings, and progress tracking.
          </p>
          <button className="bg-[#1173D4] hover:bg-[#0B5A9F] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Link GitHub Account
          </button>
          <div className="mt-6">
            <button className="text-[#92adc9] hover:text-[#1173D4] transition-colors">
              Login with Existing Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mock user data for logged-in view
  const userData = {
    name: 'John Doe',
    githubUsername: 'johndoe',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJNxJLqm-cKdY4aWx8ptWnAQ8JKPLQg9_OZCNYBEvLHJQKTTjA_E98_R-Q=g',
    totalCommits: 1245,
    rank: 3,
    className: 'CS101',
    department: 'Computer Science',
    joinDate: 'January 2024'
  }

  const stats = [
    {
      label: 'Total Commits',
      value: userData.totalCommits.toLocaleString(),
      change: '+12% from last month',
      trend: 'up'
    },
    {
      label: 'Current Rank',
      value: `#${userData.rank}`,
      change: 'Up 2 positions',
      trend: 'up'
    },
    {
      label: 'Class Contributions',
      value: 'Top 15%',
      change: 'Improved by 5%',
      trend: 'up'
    },
    {
      label: 'Active Projects',
      value: '8',
      change: '2 new this month',
      trend: 'up'
    }
  ]

  const recentActivity = [
    { id: 1, action: 'Pushed code to project', repo: 'data-structures-101', time: '2 hours ago' },
    { id: 2, action: 'Created pull request', repo: 'algorithms-final', time: '5 hours ago' },
    { id: 3, action: 'Merged branch', repo: 'web-dev-project', time: '1 day ago' },
    { id: 4, action: 'Joined class repository', repo: 'cs101-assignments', time: '2 days ago' },
    { id: 5, action: 'Completed assignment', repo: 'homework-3', time: '3 days ago' }
  ]

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Profile Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">
          👤 My Profile
        </h1>
        <p className="text-[#92adc9] text-base font-normal leading-normal">
          Track your personal progress and achievements.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#192633] rounded-lg border border-[#233648] p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-[#1173D4] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">{userData.name}</h2>
            <p className="text-[#92adc9]">@{userData.githubUsername}</p>
            <p className="text-[#92adc9]">{userData.className} • {userData.department}</p>
          </div>
        </div>
        <div className="text-[#92adc9] text-sm">
          Member since {userData.joinDate}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#192633] rounded-lg border border-[#233648] p-4">
            <div className="text-white text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-[#92adc9] text-sm mb-2">{stat.label}</div>
            <div className="text-green-400 text-xs flex items-center gap-1">
              <span>↗️</span>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-[#192633] rounded-lg border border-[#233648] p-6">
        <h3 className="text-white text-xl font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-[#233648] last:border-b-0">
              <div>
                <div className="text-white font-medium">{activity.action}</div>
                <div className="text-[#92adc9] text-sm">{activity.repo}</div>
              </div>
              <div className="text-[#92adc9] text-sm">{activity.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievement Badges */}
      <section className="bg-[#192633] rounded-lg border border-[#233648] p-6">
        <h3 className="text-white text-xl font-bold mb-6">🏆 Achievements</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {['First Commit', 'Top Contributor', 'Early Bird', 'Consistent', 'Winner'].map((badge, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#1173D4] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-[#92adc9] text-sm font-medium">{badge}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
