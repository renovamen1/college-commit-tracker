'use client'

import { useState } from 'react'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('individuals')

  if (activeTab === 'departments') {
    return (
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
          <p className="text-white/60 mt-2">See where your class and department rank. Keep pushing to climb to the top!</p>
        </header>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('individuals')}
              >
                Individuals
              </button>
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('classes')}
              >
                Classes
              </button>
              <button
                className="bg-[#233648] text-white text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                  <option>Sort by Total Commits</option>
                  <option>Sort by Avg. Commits</option>
                  <option>Sort by Faculty Size</option>
                  <option>Sort by Student Enrollment</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-[#233648]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Faculty Size</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Total Students</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Avg. Commits / Student</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Total Commits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#facc15]">1</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Computer Science</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">125</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">31,250</td>
                  </tr>
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#c0c0c0]">2</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Electrical Engineering</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">12</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">110</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">22,000</td>
                  </tr>
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#cd7f32]">3</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Mathematics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">20</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">180</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">80</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">14,400</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">4</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Physics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">10</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">150</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">70</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">10,500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">5</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Mechanical Engineering</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">18</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">220</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">45</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">9,900</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">6</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Biology</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">25</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">300</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">9,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">7</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Chemistry</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">14</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">170</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">40</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">6,800</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">8</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Civil Engineering</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">16</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">190</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">25</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">4,750</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'classes') {
    return (
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
          <p className="text-white/60 mt-2">See where your class and department rank. Keep pushing to climb to the top!</p>
        </header>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('individuals')}
              >
                Individuals
              </button>
              <button
                className="bg-[#233648] text-white text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('classes')}
              >
                Classes
              </button>
              <button
                className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                  <option>All Departments</option>
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mathematics</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                  <option>Sort by Total Commits</option>
                  <option>Sort by Avg. Commits</option>
                  <option>Sort by Students</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-[#233648]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Class Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Avg. Commits</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Total Commits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#facc15]">1</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">CS101 - Intro to Programming</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Computer Science</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">45</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">152</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">6,840</td>
                  </tr>
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#c0c0c0]">2</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">EE250 - Circuits & Electronics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Electrical Engineering</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">38</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">145</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">5,510</td>
                  </tr>
                  <tr className="hover:bg-[#233648]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#cd7f32]">3</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">CS212 - Data Structures</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Computer Science</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">35</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">130</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">4,550</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">4</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">MA320 - Linear Algebra</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Mathematics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">25</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">120</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">3,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">5</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">CS350 - Operating Systems</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Computer Science</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">95</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">2,850</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">6</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">PHY201 - Classical Mechanics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Physics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">28</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">88</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">2,464</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">7</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">EE310 - Signal Processing</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Electrical Engineering</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">22</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">75</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">1,650</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">8</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">MA250 - Differential Equations</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Mathematics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">32</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">50</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">1,600</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: Individuals tab
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Leaderboard</h1>
        <p className="text-white/60 mt-2">See where you and your peers rank. Keep pushing to climb to the top!</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="bg-[#233648] text-white text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('individuals')}
            >
              Individuals
            </button>
            <button
              className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('classes')}
            >
              Classes
            </button>
            <button
              className="bg-transparent text-white/60 hover:bg-[#233648] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setActiveTab('departments')}
            >
              Departments
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                <option>2023-2024</option>
                <option>2022-2023</option>
                <option>2021-2022</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                </svg>
              </div>
            </div>
            <div className="relative">
              <select className="form-select appearance-none bg-[#233648] border border-[#324d67] text-white text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#1173d4]">
                <option>Total Commits</option>
                <option>Lines of Code</option>
                <option>Pull Requests</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#192633] border border-[#324d67] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-[#233648]">
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Total Commits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#324d67]">
              {/* 1st Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#facc15]">1</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCALmq1nQQo7en9Q4QxpMGPTC5suJr3aUy9xua5TlnnWSVI47brkra-UN8L2ldvnD6GQuffTtEGR1oOKyLamOTHI_XpbCY41xbKHsX0dwyKAKImt77anZYuTrdXQdojQZx-c18TioiTJVH1t9C9nnPUqNCh2DOQdy27fGEk8TMyNxkLYRFYz25r93hhExLQterSSMxp-wCnvEnoEoGannoxCo0MBhZRPdgxrMYG_phjs7omJNHoI4vdKwCtA5yzX-muf3pMTB_zS7w")'
                    }}></div>
                    <span className="font-medium">Ethan Harper</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Computer Science</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">548</td>
              </tr>

              {/* 2nd Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#c0c0c0]">2</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocK81o9Qx_rq-mv4lp-29_G-F0vYJFAp32r1QpP-68Ea=s96-c")'
                    }}></div>
                    <span className="font-medium">Olivia Bennett</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Computer Science</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">512</td>
              </tr>

              {/* 3rd Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#cd7f32]">3</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocIKk-l_829_G-5z-82vGgT-B6361rR-W-v-1g1=s96-c")'
                    }}></div>
                    <span className="font-medium">Noah Carter</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">Electrical Engineering</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">491</td>
              </tr>

              {/* 4th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">4</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a-/AOh14Gh-Q_V4B-8z_V_Y_e_i_X_J_w_J_A_G-j_C_A=s96-c")'
                    }}></div>
                    <span className="font-medium">Ava Mitchell</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Mathematics</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">453</td>
              </tr>

              {/* 5th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">5</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocL81bW8Zg_2Z-V-j5z2x-Z_C-l_A_j_Q-P=s96-c")'
                    }}></div>
                    <span className="font-medium">Liam Foster</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Computer Science</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">422</td>
              </tr>

              {/* 6th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">6</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocL-g-Z-Z_j_k_L-A-j_Q_P=s96-c")'
                    }}></div>
                    <span className="font-medium">Sophia Chen</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Computer Science</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">398</td>
              </tr>

              {/* 7th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">7</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvEk7DD7Upsm2_KJ2m8eCu9h1_U5xhtIgwaUFlBKuu-Q7ROyEr2oit9lAxpO1Rddnt-F3l0XnX6VUC_nHGbJxFd31oehOOAYDbD6dhGURCJOguNuaKWXMTnW1rrWR2hlBsoKCb8wf-gC4OXsRLjXVemIfzxP5G-2dh2cI3JT5gBX_3nf0NHRHthw59sJxe9O6kCH4VOQ4QcBELFm1eQzgwvZ7QwxuDvZr0hBH1oeElV4NfZZ-tc9ZNX7_ZD1NFnDLk48j_76lezbg")'
                    }}></div>
                    <span className="font-medium">Mason Rodriguez</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Electrical Engineering</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">375</td>
              </tr>

              {/* 8th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">8</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocACL3_L2d9ZY51JBQI1-I8jLc0dCzKy3qf7NoOoju-w-a1I0XYEkJAzxFzWdF=w120-h120-p-rp-mo-ba6-br100")'
                    }}></div>
                    <span className="font-medium">Isabella Kim</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Mathematics</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">351</td>
              </tr>

              {/* 9th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">9</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/a/ACg8ocIF9Cm5YpY-Zw_WuKrq7C5p_7EO6YHwexa7Z1jdwMsQ=s96-c-mo")'
                    }}></div>
                    <span className="font-medium">Jameson Lee</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Physics</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">320</td>
              </tr>

              {/* 10th Place */}
              <tr className="hover:bg-[#233648]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium">10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/a/a/ACg8ocJD5WZhGwAQNMwTdYsrFLZEUdHQ5tVwtzxmCfB5Dg7P1g=s96-c-mo")'
                    }}></div>
                    <span className="font-medium">Harper Garcia</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">Computer Science</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">305</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
