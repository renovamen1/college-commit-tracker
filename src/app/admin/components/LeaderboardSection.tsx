'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface Contributor {
  id: string
  rank: number
  className: string
  commits: number
}

const mockLeaderboard: Contributor[] = [
  { id: '1', rank: 1, className: 'Class of 2024', commits: 1250 },
  { id: '2', rank: 2, className: 'Class of 2025', commits: 1100 },
  { id: '3', rank: 3, className: 'Class of 2026', commits: 950 },
  { id: '4', rank: 4, className: 'Class of 2027', commits: 800 },
  { id: '5', rank: 5, className: 'Class of 2028', commits: 650 },
]

type TabType = 'classes' | 'departments'

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<TabType>('classes')

  return (
    <section>
      <h3 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4">
        Leaderboard
      </h3>

      {/* Tab Navigation */}
      <div className="px-4 py-3">
        <div className="flex border-b border-[#233648] gap-6">
          <button
            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
              activeTab === 'classes'
                ? 'border-b-[#1173D4] text-white'
                : 'border-b-transparent text-[#92adc9] hover:text-white hover:border-b-[#1173D4]'
            }`}
            onClick={() => setActiveTab('classes')}
          >
            <p className="text-sm font-semibold leading-normal">Classes</p>
          </button>
          <button
            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
              activeTab === 'departments'
                ? 'border-b-[#1173D4] text-white'
                : 'border-b-transparent text-[#92adc9] hover:text-white hover:border-b-[#1173D4]'
            }`}
            onClick={() => setActiveTab('departments')}
          >
            <p className="text-sm font-semibold leading-normal">Departments</p>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 py-3">
        <div className="overflow-hidden rounded-md border border-[#233648] bg-[#192633]">
          <table className="w-full">
            <thead className="bg-[#111A22]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  {activeTab === 'classes' ? 'Class' : 'Department'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Commits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233648]">
              {mockLeaderboard.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {item.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.commits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
