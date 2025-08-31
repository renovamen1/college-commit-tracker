'use client'

import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    // Redirect to home (which will show landing page)
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar - Profile Info */}
        <div className="col-span-3">
          <div className="flex flex-col items-center gap-4 bg-[#192633] border border-[#233648] rounded-lg p-6">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24" style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCALmq1nQQo7en9Q4QxpMGPTC5suJr3aUy9xua5TlnnWSVI47brkra-UN8L2ldvnD6GQuffTtEGR1oOKyLamOTHI_XpbCY41xbKHsX0dwyKAKImt77anZYuTrdXQdojQZx-c18TioiTJVH1t9C9nnPUqNCh2DOQdy27fGEk8TMyNxkLYRFYz25r93hhExLQterSSMxp-wCnvEnoEoGannoxCo0MBhZRPdgxrMYG_phjs7omJNHoI4vdKwCtA5yzX-muf3pMTB_zS7w")'
            }}></div>
            <div className="text-center">
              <h2 className="text-white text-2xl font-bold">Ethan Harper</h2>
              <p className="text-white/60">@ethanharper</p>
            </div>
            <div className="flex gap-4 self-stretch">
              <div className="flex-1 text-center bg-[#233648] rounded-md p-3">
                <p className="text-white/60 text-sm">Class Rank</p>
                <p className="text-white text-xl font-bold">#5</p>
              </div>
              <div className="flex-1 text-center bg-[#233648] rounded-md p-3">
                <p className="text-white/60 text-sm">Dept. Rank</p>
                <p className="text-white text-xl font-bold">#2</p>
              </div>
            </div>
            <div className="w-full">
              <p className="text-white/60 text-sm">Total Contributions</p>
              <div className="bg-[#233648] rounded-full h-2.5 mt-1">
                <div className="bg-[#1173d4] h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-white text-right font-semibold mt-1">548</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-white text-lg font-semibold mb-3">Settings</h3>
            <div className="flex flex-col gap-3">
              <a className="flex items-center gap-3 text-white/80 hover:text-white bg-[#192633] hover:bg-[#233648] border border-[#233648] rounded-lg p-4 transition-colors" href="#">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Account</span>
              </a>
              <a className="flex items-center gap-3 text-white/80 hover:text-white bg-[#192633] hover:bg-[#233648] border border-[#233648] rounded-lg p-4 transition-colors" href="#">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Preferences</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 bg-[#192633] hover:bg-red-900/20 border border-[#233648] rounded-lg p-4 transition-colors w-full text-left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Activity Log */}
        <div className="col-span-9">
          <div className="bg-[#192633] border border-[#233648] rounded-lg p-6">
            <h3 className="text-white text-xl font-bold mb-4">Activity Log</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[#1173d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-semibold">Ethan Harper</span> pushed a commit to{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">CommitTracker/main</a>
                  </p>
                  <p className="text-white/60 text-sm">feat: Implement user profile page</p>
                  <p className="text-white/40 text-xs mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-semibold">Ethan Harper</span> opened a pull request in{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">CommitTracker/main</a>
                  </p>
                  <p className="text-white/60 text-sm">#42: Add leaderboard filtering</p>
                  <p className="text-white/40 text-xs mt-1">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[#1173d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-semibold">Ethan Harper</span> pushed a commit to{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">CommitTracker/main</a>
                  </p>
                  <p className="text-white/60 text-sm">fix: Correct alignment on dashboard cards</p>
                  <p className="text-white/40 text-xs mt-1">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[#1173d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-semibold">Ethan Harper</span> pushed a commit to{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">Student-Projects/project-alpha</a>
                  </p>
                  <p className="text-white/60 text-sm">docs: Update README with setup instructions</p>
                  <p className="text-white/40 text-xs mt-1">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    Pull request{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">#38</a> was closed in{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">CommitTracker/main</a>
                  </p>
                  <p className="text-white/40 text-xs mt-1">6 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#233648] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-semibold">Ethan Harper</span> opened a pull request in{' '}
                    <a className="text-[#1173d4] hover:underline" href="#">CommitTracker/main</a>
                  </p>
                  <p className="text-white/60 text-sm">#38: Refactor authentication service</p>
                  <p className="text-white/40 text-xs mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
