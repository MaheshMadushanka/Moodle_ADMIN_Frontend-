import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react'

const ITEMS_PER_PAGE = 5

function CourseReportTable({ isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(1)

  const courseData = [
    {
      id: 1,
      course: 'BIT Student Matters',
      instructor: 'Dr. John Smith',
      enrolled: 245,
      completionRate: 82,
      rating: 4.8,
    },
    {
      id: 2,
      course: 'Administrative Matters',
      instructor: 'Prof. Jane Doe',
      enrolled: 189,
      completionRate: 76,
      rating: 4.6,
    },
    {
      id: 3,
      course: 'Orientation 24In2',
      instructor: 'Mr. Alex Johnson',
      enrolled: 312,
      completionRate: 88,
      rating: 4.9,
    },
    {
      id: 4,
      course: 'Pre Academic Week',
      instructor: 'Dr. Sarah Wilson',
      enrolled: 156,
      completionRate: 71,
      rating: 4.4,
    },
    {
      id: 5,
      course: 'Python Programming',
      instructor: 'Mr. Mike Brown',
      enrolled: 420,
      completionRate: 65,
      rating: 4.5,
    },
    {
      id: 6,
      course: 'Web Development',
      instructor: 'Ms. Emily Davis',
      enrolled: 289,
      completionRate: 79,
      rating: 4.7,
    },
    {
      id: 7,
      course: 'Data Science Basics',
      instructor: 'Dr. Robert Taylor',
      enrolled: 167,
      completionRate: 73,
      rating: 4.6,
    },
  ]

  const totalPages = Math.ceil(courseData.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedData = courseData.slice(startIdx, endIdx)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
            <tr>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Course Name
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Instructor
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Enrolled
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Completion
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Rating
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedData.map(row => (
              <tr
                key={row.id}
                className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
              >
                <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {row.course}
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {row.instructor}
                </td>
                <td className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {row.enrolled.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-slate-300 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${row.completionRate}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      {row.completionRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="text-yellow-400" size={16} fill="currentColor" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      {row.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Page {currentPage} of {totalPages} ({courseData.length} courses)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? isDarkMode
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 cursor-not-allowed'
                : isDarkMode
                ? 'text-slate-200 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? isDarkMode
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 cursor-not-allowed'
                : isDarkMode
                ? 'text-slate-200 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseReportTable
