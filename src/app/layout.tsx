import type { Metadata } from 'next'
import './globals.css'
import { HoverNotifications, SearchIcon, ProfileAvatar } from '@/components/ui/NavigationIcons'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'CollegeCommit | Track Your Progress',
  description: 'Track and analyze GitHub commits for college students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-primary bg-[#111A22] text-white overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#233648] px-10 py-3 bg-[#111A22]">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] capitalize">
                CommitTracker
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-white text-sm font-medium leading-normal hover:text-[#1173D4] transition-colors" href="/admin">
                Dashboard
              </a>
              <a className="text-gray-400 text-sm font-medium leading-normal hover:text-[#1173D4] transition-colors" href="/admin/leaderboard">
                Leaderboard
              </a>
              <a className="text-gray-400 text-sm font-medium leading-normal hover:text-[#1173D4] transition-colors" href="/admin/students">
                Classes
              </a>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <HoverNotifications />
              <ProfileAvatar />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 justify-center py-10 px-4 sm:px-10">
            <div className="layout-content-container flex w-full max-w-6xl flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
