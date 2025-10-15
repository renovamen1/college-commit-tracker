'use client'

import { Logo } from '@/components/ui/Logo'
import { useState } from 'react'

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-[#111a22]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                College Commit Tracker
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                Quickly find rankings for classes, departments, and students.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="search"
                    placeholder='e.g., "Computer Science 2025" or "John Doe"'
                    className="w-full h-14 pl-12 pr-4 rounded-md border border-[var(--accent-color)] bg-[var(--secondary-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                    <SearchIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-[var(--secondary-color)]/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Top Departments */}
              <div className="bg-[var(--secondary-color)] rounded-lg p-6 border border-[var(--accent-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Top Departments</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">1. Computer Science</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">1,234 commits</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">2. Electrical Engineering</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">987 commits</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">3. Data Science</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">852 commits</span>
                  </li>
                </ul>
              </div>

              {/* Top Contributors */}
              <div className="bg-[var(--secondary-color)] rounded-lg p-6 border border-[var(--accent-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Top Contributors</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">1. Alice Johnson</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">152 commits</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">2. Bob Williams</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">128 commits</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[var(--text-primary)]">3. Charlie Brown</span>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">110 commits</span>
                  </li>
                </ul>
              </div>

              {/* Recent Activity */}
              <div className="bg-[var(--secondary-color)] rounded-lg p-6 border border-[var(--accent-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                  <li className="text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--text-primary)] font-medium">David Lee</span> pushed to{' '}
                    <span className="text-[var(--primary-color)]">CS101-Project</span>
                  </li>
                  <li className="text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--text-primary)] font-medium">Emily Chen</span> pushed to{' '}
                    <span className="text-[var(--primary-color)]">EE250-Lab3</span>
                  </li>
                  <li className="text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--text-primary)] font-medium">Frank Miller</span> pushed to{' '}
                    <span className="text-[var(--primary-color)]">DS410-Final</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#111a22]/50 border-t border-[#233648]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-[var(--text-secondary)]">
            © 2024 CommitTracker.  friendly neighbourhood  project.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Search Icon Component
function SearchIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
    </svg>
  )
}
