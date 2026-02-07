import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import SummaryCards from '../../components/reports/SummaryCards'
import FiltersBar from '../../components/reports/FiltersBar'
import CourseReportTable from '../../components/reports/CourseReportTable'
import StudentReportTable from '../../components/reports/StudentReportTable'
import ChartsSection from '../../components/reports/ChartsSection'

function Reports() {
  const { isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: '2026-01-01',
    endDate: '2026-02-07',
    course: '',
    instructor: '',
  })

  // Simulated statistics
  const stats = {
    totalCourses: 12,
    totalStudents: 542,
    totalInstructors: 8,
    totalEnrollments: 1245,
  }

  // Simulate loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleExportCSV = () => {
    alert('CSV export will be implemented with backend integration')
  }

  const handleExportPDF = () => {
    alert('PDF export will be implemented with backend integration')
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <div className={`text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Reports & Analytics
          </h1>
          <p className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Monitor course performance, student activity, and enrollment metrics
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards stats={stats} isDarkMode={isDarkMode} />

        {/* Filters Bar */}
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          isDarkMode={isDarkMode}
        />

        {/* Charts Section */}
        <ChartsSection isDarkMode={isDarkMode} />

        {/* Course Reports Section */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Course Reports
          </h2>
          <CourseReportTable isDarkMode={isDarkMode} />
        </div>

        {/* Student Activity Section */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Student Activity
          </h2>
          <StudentReportTable isDarkMode={isDarkMode} />
        </div>

        {/* Enrollment Report Section */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Recent Enrollments
          </h2>
          <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      Course
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      New Enrollments
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      Enrollment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[
                    { course: 'BIT Student Matters', enrollments: 12, date: '2026-02-06' },
                    { course: 'Administrative Matters', enrollments: 8, date: '2026-02-06' },
                    { course: 'Orientation 24In2', enrollments: 15, date: '2026-02-07' },
                    { course: 'Pre Academic Week', enrollments: 5, date: '2026-02-05' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                    >
                      <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {row.course}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'}`}>
                          {row.enrollments}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {new Date(row.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports