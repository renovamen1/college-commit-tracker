export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header with Class Selector */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter min-w-72">Computer Science 101</h1>
          <div className="relative">
            <select className="form-select w-72 appearance-none rounded-md border border-[#324d67] bg-[#192633] px-4 py-2.5 text-white focus:border-[#1172d4] focus:outline-none focus:ring-1 focus:ring-[#1172d4]">
              <option>Computer Science 101</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
              <option>Overall College Metrics</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
        </div>
        <p className="text-white/60 mt-2">Detailed view of class activity and contributions.</p>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-[#324d67]">
        <nav className="flex gap-8">
          <button className="flex items-center justify-center border-b-2 border-b-[#1172d4] text-white pb-3 pt-1">
            <p className="text-white text-sm font-semibold leading-normal">Overview</p>
          </button>
          <button className="flex items-center justify-center border-b-2 border-b-transparent text-white/60 hover:text-white transition-colors pb-3 pt-1">
            <p className="text-sm font-semibold leading-normal">Members</p>
          </button>
          <button className="flex items-center justify-center border-b-2 border-b-transparent text-white/60 hover:text-white transition-colors pb-3 pt-1">
            <p className="text-sm font-semibold leading-normal">Repositories</p>
          </button>
        </nav>
      </div>

      {/* Activity Metrics */}
      <section className="mt-8">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Activity Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Total Commits</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">1,250</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Active Contributors</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">45</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md p-6 bg-[#192633] border border-[#324d67]">
            <p className="text-white/60 text-base font-medium leading-normal">Repositories</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">12</p>
          </div>
        </div>
      </section>

      {/* Member Contributions */}
      <section className="mt-12">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Member Contributions</h2>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
              <table className="min-w-full divide-y divide-[#324d67]">
                <thead className="bg-[#192633]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Commits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Ethan Harper</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Olivia Bennett</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">220</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">3 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Noah Carter</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">1 day ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Ava Mitchell</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">180</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">4 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Liam Foster</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">150</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Repository Activity */}
      <section className="mt-12">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Repository Activity</h2>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
              <table className="min-w-full divide-y divide-[#324d67]">
                <thead className="bg-[#192633]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Repository</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Commits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Project A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">1 day ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Project B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">400</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Project C</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">350</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">3 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
