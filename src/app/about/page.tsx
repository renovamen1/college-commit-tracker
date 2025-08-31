'use client'

import { Logo } from '@/components/ui/Logo'

export default function AboutPage() {
  return (
    <div style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>

      {/* Hero Section with Background */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYbY4hpLyN8VXOSX-0E6qZjdI8TJvdEqSaKiqMtrQbkJqXN5BwING2U3w4E34WzlqdQVhanMcGytIrT6kHaMjk8DbkEMGuiT3v1yg96kOfbX8yr3FEfbldBv0GuXFa4GsNmZXfDtM3kbANHONyt4rAdfPB6Puz-yrAhey7z2q9W8RIMvo3AUqHM7pu9PitSg3RPTGwjU74aEIxo5qEraE9kL5vlmVKxx41_6I59fdeDoDKs3NywvyV3lslriCEsgYu6bU04_7RBGI")`
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111a22]/80 via-[#111a22]/60 to-[#111a22]/80"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] tracking-tighter mb-4">
              Gamify Your Academic Journey
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              Track, compete, and celebrate your GitHub contributions with fellow students and departments.
              Turn coding into a collaborative game and boost your skills together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-[var(--text-primary)] text-base font-bold leading-normal tracking-wide hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/30">
                <span className="truncate">Get Started Now</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--accent-color)] text-[var(--text-primary)] text-base font-bold leading-normal tracking-wide hover:bg-gray-700 transition-colors">
                <span className="truncate">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-[var(--secondary-color)]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Why CommitTracker?
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              CommitTracker transforms your coding contributions into a friendly competition, fostering
              collaboration and skill development within academic teams.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Leaderboards */}
            <div className="flex flex-col gap-4 rounded-lg border border-[#324d67] bg-[var(--secondary-color)] p-6 transition-all duration-300 hover:border-[var(--primary-color)] hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
              <div className="text-[var(--primary-color)]">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M232,64H208V56a16,16,0,0,0-16-16H64A16,16,0,0,0,48,56v8H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-28.49,64.64-63.51,64.9H128a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Student Leaderboards
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Compete with peers and climb the ranks based on your GitHub activity.
                  Earn badges and recognition for your coding achievements.
                </p>
              </div>
            </div>

            {/* Department Rankings */}
            <div className="flex flex-col gap-4 rounded-lg border border-[#324d67] bg-[var(--secondary-color)] p-6 transition-all duration-300 hover:border-[var(--primary-color)] hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
              <div className="text-[var(--primary-color)]">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Department Rankings
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  See how your department stacks up against others. Encourage teamwork and collective
                  progress towards coding excellence.
                </p>
              </div>
            </div>

            {/* Real-time Tracking */}
            <div className="flex flex-col gap-4 rounded-lg border border-[#324d67] bg-[var(--secondary-color)] p-6 transition-all duration-300 hover:border-[var(--primary-color)] hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
              <div className="text-[var(--primary-color)]">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Real-time Tracking
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Stay updated with live insights into your contributions and team performance.
                  Track your progress and celebrate milestones together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Ready to Level Up Your Coding Game?
            </h2>
            <div className="mt-8 flex justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-8 bg-[var(--primary-color)] text-[var(--text-primary)] text-lg font-bold leading-normal tracking-wide hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/30">
                <span className="truncate">Join CommitTracker Today</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111a22]/50 border-t border-[#233648]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors" href="#">
                Terms of Service
              </a>
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors" href="#">
                Contact Us
              </a>
            </div>
            <div className="flex justify-center gap-6">
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M245.66,123.51A16,16,0,0,0,240,120H209.57A48.66,48.66,0,0,0,168.1,96a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,152v6.09C79.74,147.47,46.81,114.72,46.46,114.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,309.7,65.48,312,80,312c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,245.66,123.51Zm-45,29.41a8,8,0,0,0-2.32,5.14C198,246.58,143.28,296,80,296c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,249.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,176V152a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,128c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,152h16Z"></path>
                </svg>
              </a>
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                </svg>
              </a>
              <a className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            © 2024 CommitTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
