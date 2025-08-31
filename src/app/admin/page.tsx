import { GitHubActivityChart } from './components/GitHubActivityChart'
import { TopContributors } from './components/TopContributors'
import { LeaderboardSection } from './components/LeaderboardSection'

export default function AdminDashboard() {
  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-white text-4xl font-bold leading-tight tracking-tighter">
          Dashboard
        </h2>
        <p className="text-[#92adc9] text-base font-normal leading-normal">
          Track your progress and see how your class and department are doing.
        </p>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Leaderboard Section */}
          <LeaderboardSection />

          {/* GitHub Activity Section */}
          <section className="bg-[#192633] rounded-md border border-[#233648] p-6">
            <GitHubActivityChart />
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="lg:col-span-1">
          <TopContributors />
        </aside>
      </div>
    </>
  )
}
