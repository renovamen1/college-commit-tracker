'use client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#111A22] text-white">
      {/* Layout only handles basic structure - individual pages handle their own headers */}
      <main className="flex flex-1">
        {children}
      </main>
    </div>
  )
}
