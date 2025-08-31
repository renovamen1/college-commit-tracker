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
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter min-w-72">Dashboard</h1>
        <p className="text-white/60 mt-2">Your personal GitHub activity overview.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Your Stats Section */}
          <section>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Your Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
                <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
                <p className="text-white tracking-light text-3xl font-bold leading-tight">789</p>
              </div>
              <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
                <p className="text-white/60 text-base font-medium leading-normal">Current Streak</p>
                <p className="text-white tracking-light text-3xl font-bold leading-tight">42 days</p>
              </div>
            </div>
          </section>

          {/* Contribution Streak Section */}
          <section className="mt-12">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Contribution Streak</h2>
            <div className="mt-4 p-6 rounded-md bg-[#192633] border border-[#324d67] flex flex-col gap-4">
              {/* Days of the Week */}
              <div className="flex justify-between items-center text-white/80 text-sm">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Contribution Grid - GitHub style */}
              <div className="grid grid-cols-7 gap-2">
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">5 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">8 commits</span></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-[#174828] tooltip"><span className="tooltip-text">12 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">3 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#1d6b38] tooltip"><span className="tooltip-text">15 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#228442] tooltip"><span className="tooltip-text">20 commits</span></div>

                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">6 commits</span></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">7 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#174828] tooltip"><span className="tooltip-text">10 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#1d6b38] tooltip"><span className="tooltip-text">18 commits</span></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">4 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#174828] tooltip"><span className="tooltip-text">11 commits</span></div>

                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">5 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">9 commits</span></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-[#1d6b38] tooltip"><span className="tooltip-text">16 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#228442] tooltip"><span className="tooltip-text">22 commits</span></div>
                <div className="aspect-square rounded-sm bg-[#174828] tooltip"><span className="tooltip-text">14 commits</span></div>

                <div className="aspect-square rounded-sm bg-[#112d1c] tooltip"><span className="tooltip-text">8 commits</span></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
                <div className="aspect-square rounded-sm bg-transparent border border-[#324d67]"></div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          {/* Class Leaderboard */}
          <section>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Class Leaderboard</h2>
            <div className="mt-4 rounded-md border border-[#324d67] bg-[#192633]">
              <div className="p-4 border-b border-[#324d67]">
                <p className="text-white font-semibold">Computer Science 101</p>
                <p className="text-sm text-white/60">Your rank: <span className="text-white font-bold">#3</span></p>
              </div>
              <ul className="divide-y divide-[#324d67]">
                <li className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 font-semibold">1.</span>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEtyo6-eKKpOcki9pHrb4TrqC15OlMzRp5qMofQ4Unuf31y_uzTxROxqwGpoivgAbORFGyjol0IMzvuvM68zjja-cF0rE8l-SwFXdEfjhsJ5FdyxuKc6JQJL_ss5CSDGH6MR1ArMp4DdcEP1v5R2vKc60J3eYbURsAs3tJ-lcMUcWxIzGHIkEEXuKILQeCtSg6YxOO6VIUXR_3u-MLR3QMitsrvfSSxzOit9i5seYmQl6WUQoX9BX3ggxYxibIiYEHvy8eKhEYwYg")'
                    }}></div>
                    <p className="text-white text-sm font-medium">Ethan Harper</p>
                  </div>
                  <p className="text-sm text-[#92adc9]">250 commits</p>
                </li>
                <li className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 font-semibold">2.</span>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEtyo6-eKKpOcki9pHrb4TrqC15OlMzRp5qMofQ4Unuf31y_uzTxROxqwGpoivgAbORFGyjol0IMzvuvM68zjja-cF0rE8l-SwFXdEfjhsJ5FdyxuKc6JQJL_ss5CSDGH6MR1ArMp4DdcEP1v5R2vKc60J3eYbURsAs3tJ-lcMUcWxIzGHIkEEXuKILQeCtSg6YxOO6VIUXR_3u-MLR3QMitsrvfSSxzOit9i5seYmQl6WUQoX9BX3ggxYxibIiYEHvy8eKhEYwYg")'
                    }}></div>
                    <p className="text-white text-sm font-medium">Olivia Bennett</p>
                  </div>
                  <p className="text-sm text-[#92adc9]">220 commits</p>
                </li>
                <li className="p-4 flex items-center justify-between bg-[#111a22]">
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 font-semibold">3.</span>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCALmq1nQQo7en9Q4QxpMGPTC5suJr3aUy9xua5TlnnWSVI47brkra-UN8L2ldvnD6GQuffTtEGR1oOKyLamOTHI_XpbCY41xbKHsX0dwyKAKImt77anZYuTrdXQdojQZx-c18TioiTJVH1t9C9nnPUqNCh2DOQdy27fGEk8TMyNxkLYRFYz25r93hhExLQterSSMxp-wCnvEnoEoGannoxCo0MBhZRPdgxrMYG_phjs7omJNHoI4vdKwCtA5yzX-muf3pMTB_zS7w")'
                    }}></div>
                    <p className="text-white text-sm font-medium">You</p>
                  </div>
                  <p className="text-sm text-[#92adc9]">200 commits</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Repositories */}
          <section className="mt-8">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Your Repositories</h2>
            <div className="mt-4 space-y-3">
              <a className="block p-4 rounded-md bg-[#192633] border border-[#324d67] hover:border-[#1172d4] transition-colors" href="#">
                <p className="text-white font-semibold">Project-Alpha</p>
                <p className="text-sm text-white/60">Updated 2 days ago</p>
              </a>
              <a className="block p-4 rounded-md bg-[#192633] border border-[#324d67] hover:border-[#1172d4] transition-colors" href="#">
                <p className="text-white font-semibold">Data-Structures-Lab</p>
                <p className="text-sm text-white/60">Updated 5 days ago</p>
              </a>
              <a className="block p-4 rounded-md bg-[#192633] border border-[#324d67] hover:border-[#1172d4] transition-colors" href="#">
                <p className="text-white font-semibold">Personal-Website</p>
                <p className="text-sm text-white/60">Updated 1 week ago</p>
              </a>
            </div>
          </section>

          {/* Settings Section */}
          <section className="mt-8">
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
          </section>
        </div>
      </div>

<style jsx>{`
      .tooltip {
        position: relative;
        display: inline-block;
      }
      .tooltip .tooltip-text {
        visibility: hidden;
        width: 100px;
        background-color: #0b1218;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -50px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
      }
    `}</style>
    </div>
  )
}
