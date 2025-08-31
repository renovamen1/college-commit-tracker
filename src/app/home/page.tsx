'use client'

export default function HomeDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">Dashboard</h1>
        <p className="text-white/60 mt-2">A high-level overview of the college's GitHub activity.</p>
      </header>

      {/* Dashboard Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Stats and Lists */}
        <div className="lg:col-span-2">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">24,589</p>
            </div>
            <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <p className="text-white/60 text-base font-medium leading-normal">Total Contributors</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">832</p>
            </div>
            <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <p className="text-white/60 text-base font-medium leading-normal">Active Repositories</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">128</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Classes */}
            <div className="flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Classes</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Computer Science 101</span>
                  <span className="text-[#92adc9]">1,250 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Data Structures</span>
                  <span className="text-[#92adc9]">1,100 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Algorithms</span>
                  <span className="text-[#92adc9]">980 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Software Engineering</span>
                  <span className="text-[#92adc9]">950 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Operating Systems</span>
                  <span className="text-[#92adc9]">890 commits</span>
                </li>
              </ul>
            </div>

            {/* Top Departments */}
            <div className="flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Departments</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Computer Science</span>
                  <span className="text-[#92adc9]">15,340 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Electrical Engineering</span>
                  <span className="text-[#92adc9]">5,210 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Mathematics</span>
                  <span className="text-[#92adc9]">2,890 commits</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-white">Physics</span>
                  <span className="text-[#92adc9]">1,149 commits</span>
                </li>
              </ul>
            </div>

            {/* Top Individual Contributors */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67]">
              <h3 className="text-white text-xl font-bold leading-tight">Top Individual Contributors</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <tbody className="divide-y divide-[#324d67]">
                    <tr>
                      <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">Ethan Harper</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">Computer Science</td>
                      <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">312 commits</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">Olivia Bennett</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">Computer Science</td>
                      <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">298 commits</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">Noah Carter</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">Electrical Engineering</td>
                      <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">255 commits</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 whitespace-nowrap text-sm font-medium text-white">Ava Mitchell</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-[#92adc9]">Mathematics</td>
                      <td className="py-3 pl-6 whitespace-nowrap text-sm text-[#92adc9] text-right">241 commits</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-4 rounded-md p-6 bg-[#192633] border border-[#324d67] h-full">
            <h3 className="text-white text-xl font-bold leading-tight">Recent Activity</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocK81o9Qx_rq-mv4lp-29_G-F0vYJFAp32r1QpP-68Ea=s96-c")'
                }}></div>
                <div className="text-sm">
                  <p className="text-white">
                    <span className="font-semibold">Liam Foster</span> pushed to{' '}
                    <span className="font-semibold">Project Phoenix</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocIKk-l_829_G-5z-82vGgT-B6361rR-W-v-1g1=s96-c")'
                }}></div>
                <div className="text-sm">
                  <p className="text-white">
                    <span className="font-semibold">Sophia Chen</span> opened a pull request in{' '}
                    <span className="font-semibold">Data Vis</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">5 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/a-/AOh14Gh-Q_V4B-8z_V_Y_e_i_X_J_w_J_A_G-j_C_A=s96-c")'
                }}></div>
                <div className="text-sm">
                  <p className="text-white">
                    <span className="font-semibold">Mason Rodriguez</span> commented on an issue in{' '}
                    <span className="font-semibold">Algo-Trading Bot</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocL81bW8Zg_2Z-V-j5z2x-Z_C-l_A_j_Q-P=s96-c")'
                }}></div>
                <div className="text-sm">
                  <p className="text-white">
                    <span className="font-semibold">Isabella Kim</span> forked{' '}
                    <span className="font-semibold">ML-Toolkit</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocL-g-Z-Z_j_k_L-A-j_Q_P=s96-c")'
                }}></div>
                <div className="text-sm">
                  <p className="text-white">
                    <span className="font-semibold">Jameson Lee</span> pushed to{' '}
                    <span className="font-semibold">Web-Crawler</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">2 days ago</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
