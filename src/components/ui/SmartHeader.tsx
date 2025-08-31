'use client'

import { usePathname } from 'next/navigation'
import { Logo } from './Logo'

export function SmartHeader() {
  const pathname = usePathname()

  // Don't show SmartHeader on home pages (HomeLayout handles its own header)
  if (pathname.startsWith('/home') || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#111a22]/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 text-[var(--text-primary)]">
            <Logo />
            <h1 className="text-xl font-bold tracking-tight">CommitTracker</h1>
          </div>

          {/* Landing Page Navigation */}
          <nav className="flex items-center gap-6">
            <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/home">
              Home
            </a>
            <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/about">
              About
            </a>
            <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium" href="/login">
              Login
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
