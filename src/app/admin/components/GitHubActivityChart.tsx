'use client'

export function GitHubActivityChart() {
  // Mock data points for the chart (matching the design)
  const data = [109, 21, 41, 93, 33, 101, 61, 45, 121, 149, 1, 81, 129, 25]
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium leading-normal">Commits Over Time</p>
          <p className="text-white text-3xl font-bold leading-tight truncate">
            10,500
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <p className="text-gray-400">Last 30 Days</p>
          <div className="flex items-center gap-1">
            <span className="text-[#0BDA5B]">+15%</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2.5V9.5M2.5 6H9.5" stroke="#0BDA5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 h-48">
        <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
          <svg viewBox="0 0 472 150" width="100%" height="100%">
            {/* Define reusable path */}
            <defs>
              <linearGradient id="chart-gradient" x1="236" y1="1" x2="236" y2="150">
                <stop offset="0%" stopColor="#1173D4" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#111A22" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Generate points from data */}
            {(() => {
              const points: number[][] = []
              const width = 472
              const height = 150
              const padding = 10

              data.forEach((value, index) => {
                const x = (width / (data.length - 1)) * index
                const normalizedValue = (value - minValue) / (maxValue - minValue)
                const y = height - padding - (normalizedValue * (height - padding * 2))
                points.push([x, y])
              })

              // Create path string
              const pathData = points.map((point, index) =>
                `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
              ).join(' ')

              // Create filled area path
              const reversedPoints = [...points].reverse().map(point =>
                point.map((coord, axis) => axis === 1 ? 150 : coord).join(' ') + ' '
              )
              const areaPathData = pathData + ' ' + reversedPoints.join(' ') + ' Z'

              return (
                <>
                  <path d={areaPathData} fill="url(#chart-gradient)" />
                  <path
                    d={pathData}
                    stroke="#1173D4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )
            })()}
          </svg>
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs font-medium text-gray-400 pt-2">
        <p>Week 1</p>
        <p>Week 2</p>
        <p>Week 3</p>
        <p>Week 4</p>
      </div>
    </div>
  )
}
