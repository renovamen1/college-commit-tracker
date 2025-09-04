'use client'

import { useState } from 'react'

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('overview')

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
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-center border-b-2 transition-colors pb-3 pt-1 ${
              activeTab === 'overview' ? 'border-b-[#1172d4] text-white' : 'border-b-transparent text-white/60 hover:text-white'
            }`}
          >
            <p className="text-sm font-semibold leading-normal">Overview</p>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center justify-center border-b-2 transition-colors pb-3 pt-1 ${
              activeTab === 'members' ? 'border-b-[#1172d4] text-white' : 'border-b-transparent text-white/60 hover:text-white'
            }`}
          >
            <p className="text-sm font-semibold leading-normal">Members</p>
          </button>
          <button
            onClick={() => setActiveTab('repositories')}
            className={`flex items-center justify-center border-b-2 transition-colors pb-3 pt-1 ${
              activeTab === 'repositories' ? 'border-b-[#1172d4] text-white' : 'border-b-transparent text-white/60 hover:text-white'
            }`}
          >
            <p className="text-sm font-semibold leading-normal">Repositories</p>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
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
        </>
      )}

      {/* Members Tab Content */}
      {activeTab === 'members' && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Members List</h2>
            <div className="flex gap-4 items-center">
              <label className="flex flex-col min-w-40 !h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-md h-full">
                  <div className="text-[#92adc9] flex border-none bg-[#192633] items-center justify-center pl-3 rounded-l-md border-r-0">
                    <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white focus:outline-0 focus:ring-0 border-none bg-[#192633] focus:border-none h-full placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="Search members..." value=""/>
                </div>
              </label>
              <div className="relative">
                <select className="form-select w-48 appearance-none rounded-md border border-[#324d67] bg-[#192633] px-4 py-2.5 text-white focus:border-[#1172d4] focus:outline-none focus:ring-1 focus:ring-[#1172d4]">
                  <option>Sort by Rank</option>
                  <option>Sort by Commits</option>
                  <option>Sort by Name</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
                <table className="min-w-full divide-y divide-[#324d67]">
                  <thead className="bg-[#192633]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">GitHub Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Total Commits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Lines of Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#324d67]">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Ethan Harper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">ethanharper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">250</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">15,432</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Olivia Bennett</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">oliviabenn</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">220</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">14,876</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Noah Carter</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">noahc</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">200</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">13,987</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">4</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Ava Mitchell</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">avamyth</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">180</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">12,500</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Liam Foster</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">liamfost</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">150</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">11,234</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">6</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sophia Rodriguez</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">sophiarod</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">145</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">10,987</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">7</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Mason Garcia</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">masong</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">130</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">10,112</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">8</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Isabella Chen</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">isachen</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">120</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">9,876</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Repositories Tab Content */}
      {activeTab === 'repositories' && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Repositories</h2>
            <div className="flex gap-4 items-center">
              <label className="flex flex-col min-w-40 !h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-md h-full">
                  <div className="text-[#92adc9] flex border-none bg-[#192633] items-center justify-center pl-3 rounded-l-md border-r-0">
                    <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white focus:outline-0 focus:ring-0 border-none bg-[#192633] focus:border-none h-full placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="Search repositories..." value=""/>
                </div>
              </label>
              <div className="relative">
                <select className="form-select w-48 appearance-none rounded-md border border-[#324d67] bg-[#192633] px-4 py-2.5 text-white focus:border-[#1172d4] focus:outline-none focus:ring-1 focus:ring-[#1172d4]">
                  <option>Sort by Commits</option>
                  <option>Sort by Last Updated</option>
                  <option>Sort by Name</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Repositories Table */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md border border-[#324d67] bg-[#111a22]">
                <table className="min-w-full divide-y divide-[#324d67]">
                  <thead className="bg-[#192633]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Repository Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Total Commits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" scope="col">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#324d67]">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Project-Alpha</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">A foundational project for learning basic algorithms.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">542</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-26</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Data-Structures-Implementations</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">Implementation of various data structures.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">489</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-25</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Web-Scraper-Bot</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">A bot to scrape data from various websites.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">312</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-24</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">AI-Chess-Engine</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">A chess engine powered by AI.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">280</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-22</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Portfolio-Website-V2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">Version 2 of the personal portfolio website.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">198</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-20</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">CS101-Labs</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">Lab exercises for the Computer Science 101 course.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">156</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-18</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Final-Project-Collaborative-Tool</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">A collaborative tool for the final project.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">123</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-15</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Learning-Python-Scripts</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">A collection of Python scripts for learning purposes.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">98</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92adc9]">2023-10-12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
