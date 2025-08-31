import { Sidebar } from '@/components/layout/Sidebar'
import { ActivityTimeline } from '@/components/ui/ActivityTimeline'

export default function ProfilePage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden bg-[#111a22]">
      <div className="layout-container flex h-full grow flex-col">
        {/* Sidebar and Main Content Container */}
        <div className="flex flex-1 justify-center">
          {/* Sidebar */}
          <Sidebar activeItem="profile" />

          {/* Main Content */}
          <main className="flex max-w-7xl flex-1 flex-col p-8">
            <div className="flex w-full flex-col gap-8 @container">
              {/* Profile Header */}
              <div className="flex w-full flex-col gap-6 rounded-md border border-gray-800 bg-gray-950 p-6 @[520px]:flex-row @[520px]:items-center @[520px]:justify-between">
                <div className="flex items-center gap-6">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32" style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeWreS3t1gc2077jmInhS3iY36o6DIfUywlPIdCEfptb5ap40ZQO-Po4nLBZc6uaMPr0FfTjT9cLxoXzeFMvDrqlrAhXj_Ok7RdxgYr1FpflPGYyONOtRoANr0DuTybRVIzYY6dxyk5-SBa1X1qCrmZzfzQp5olmhR85kANvlX9Uq2vlG4-Fhp6v2NEdWC1Qj-L0rFp0VhfEIRaQwrP9ksmHrp6uX-V8BMrL1R7CIgce1OtSr0rV5jqe9m-iwvwmaNgT_GbA8jmIE")`
                  }}></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                      Ethan Carter
                    </p>
                    <p className="text-gray-400 text-lg font-normal leading-normal">
                      Computer Science
                    </p>
                  </div>
                </div>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:ring-offset-2 focus:ring-offset-gray-900 w-full @[480px]:w-auto">
                  <span className="truncate">Link GitHub</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-md p-6 bg-gray-950 border border-gray-800">
                  <p className="text-gray-400 text-sm font-normal leading-normal">
                    Total Contributions
                  </p>
                  <p className="text-white tracking-tight text-4xl font-bold leading-tight">
                    1,200
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-md p-6 bg-gray-950 border border-gray-800">
                  <p className="text-gray-400 text-sm font-normal leading-normal">
                    Class Rank
                  </p>
                  <p className="text-white tracking-tight text-4xl font-bold leading-tight">
                    #50
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-md p-6 bg-gray-950 border border-gray-800">
                  <p className="text-gray-400 text-sm font-normal leading-normal">
                    Department Rank
                  </p>
                  <p className="text-white tracking-tight text-4xl font-bold leading-tight">
                    #10
                  </p>
                </div>
              </div>

              {/* Activity Timeline */}
              <ActivityTimeline />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
