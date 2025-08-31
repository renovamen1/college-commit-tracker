'use client'

import { Logo } from '@/components/ui/Logo'
import { HoverNotifications, ProfileAvatar } from '@/components/ui/NavigationIcons'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#111A22] text-white">
      {/* Admin Header - Always visible in admin section */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#233648] px-10 py-3 bg-[#111A22] sticky top-0 z-50">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <Logo />
            <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              CommitTracker
            </h1>
          </a>
          <div className="flex items-center gap-2 text-[#92adc9] text-sm">
            <span>🔒</span>
            Admin Portal
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a className={`text-sm font-medium leading-normal transition-colors ${
            pathname === '/admin' ? 'text-white' : 'text-gray-300 hover:text-[#1173D4]'
          }`} href="/admin">
            Dashboard
          </a>
          <a className={`text-sm font-medium leading-normal transition-colors ${
            pathname === '/admin/leaderboard' ? 'text-white' : 'text-gray-300 hover:text-[#1173D4]'
          }`} href="/admin/leaderboard">
            Leaderboard
          </a>
          <a className={`text-sm font-medium leading-normal transition-colors ${
            pathname === '/admin/students' ? 'text-white' : 'text-gray-300 hover:text-[#1173D4]'
          }`} href="/admin/students">
            Classes
          </a>
          <a className={`text-sm font-medium leading-normal transition-colors ${
            pathname === '/admin/manage' ? 'text-white' : 'text-gray-300 hover:text-[#1173D4]'
          }`} href="/admin/manage">
            Admin Panel
          </a>
          <a className={`text-sm font-medium leading-normal transition-colors ${
            pathname === '/profile' ? 'text-white' : 'text-gray-300 hover:text-[#1173D4]'
          }`} href="/profile">
            Profile
          </a>
        </nav>

        {/* Admin Header Actions */}
        <div className="flex items-center gap-4">
          <HoverNotifications />
          <ProfileAvatar />
          <button
            className="text-gray-300 hover:text-[#1173D4] text-sm font-medium leading-normal transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/admin/login'
              }
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-10">
        <div className="layout-content-container flex w-full max-w-6xl flex-col gap-8">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-[#111a22]/50 border-t border-[#233648] mt-auto">
        <div className="container mx-auto px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-gray-400 text-sm">
                © 2024 CommitTracker | Admin Portal
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/" className="hover:text-[#1173D4] transition-colors">
                ← Back to Public Site
              </a>
              <span>|</span>
              <span>Secure Admin Access</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
