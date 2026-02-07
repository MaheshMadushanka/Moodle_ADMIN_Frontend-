import React from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'

function ChartsSection({ isDarkMode }) {
  // Simulated enrollment data for chart
  const enrollmentData = [
    { month: 'Jan', value: 150 },
    { month: 'Feb', value: 280 },
    { month: 'Mar', value: 210 },
    { month: 'Apr', value: 320 },
    { month: 'May', value: 480 },
    { month: 'Jun', value: 550 },
  ]

  // Simulated completion data for chart
  const completionData = [
    { course: 'BIT Matters', rate: 82 },
    { course: 'Admin', rate: 76 },
    { course: 'Orientation', rate: 88 },
    { course: 'Pre-Acad', rate: 71 },
    { course: 'Python', rate: 65 },
  ]

  const maxEnrollment = Math.max(...enrollmentData.map(d => d.value))
  const chartHeight = 200

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Enrollment Growth Chart */}
      <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Enrollment Growth
          </h3>
        </div>

        {/* Chart */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex items-end justify-between h-64 gap-2 mb-4">
            {enrollmentData.map((data, idx) => {
              const barHeight = (data.value / maxEnrollment) * chartHeight
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${barHeight}px` }}
                  >
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                      {data.value}
                    </div>
                  </div>
                  <div className={`text-xs font-medium mt-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {data.month}
                  </div>
                </div>
              )
            })}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Enrollments per month
          </div>
        </div>
      </div>

      {/* Course Completion Chart */}
      <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={24} />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Course Completion Rate
          </h3>
        </div>

        {/* Chart */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'} space-y-4`}>
          {completionData.map((data, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium truncate">
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {data.course}
                </span>
              </div>
              <div className="flex-1 bg-slate-300 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all"
                  style={{ width: `${data.rate}%` }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm font-semibold">
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-900'}>
                  {data.rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartsSection
