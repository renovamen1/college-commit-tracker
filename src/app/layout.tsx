import type { Metadata } from 'next'
import './globals.css'
import { SmartHeader } from '@/components/ui/SmartHeader'

export const metadata: Metadata = {
  title: 'CommitTracker | Track Your GitHub Progress',
  description: 'Track and analyze GitHub commits for college students and departments',
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
          {/* Smart Header - Auto-detects appropriate header based on route */}
          <SmartHeader />

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
