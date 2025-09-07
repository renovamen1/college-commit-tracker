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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?display=swap&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,900&family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
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
