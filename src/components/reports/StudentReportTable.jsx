import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 5

function StudentReportTable({ isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(1)

  const studentData = [
    {
      id: 1,
      name: 'Alice Johnson',
      enrolledCourses: 5,
      completedCourses: 3,
      lastActive: '2026-02-05',
    },
    {
      id: 2,
      name: 'Bob Smith',
      enrolledCourses: 3,
      completedCourses: 2,
      lastActive: '2026-02-06',
    },
    {
      id: 3,
      name: 'Carol White',
      enrolledCourses: 7,
      completedCourses: 6,
      lastActive: '2026-02-07',
    },
    {
      id: 4,
      name: 'David Brown',
      enrolledCourses: 2,
      completedCourses: 1,
      lastActive: '2026-02-04',
    },
    {
      id: 5,
      name: 'Emma Davis',
      enrolledCourses: 4,
      completedCourses: 3,
      lastActive: '2026-02-07',
    },
    {
      id: 6,
      name: 'Frank Wilson',
      enrolledCourses: 6,
      completedCourses: 5,
      lastActive: '2026-02-03',
    },
    {
      id: 7,
      name: 'Grace Lee',
      enrolledCourses: 3,
      completedCourses: 3,
      lastActive: '2026-02-06',
    },
  ]

  const totalPages = Math.ceil(studentData.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedData = studentData.slice(startIdx, endIdx)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
            <tr>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Student Name
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Enrolled Courses
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Completed
              </th>
              <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Last Active
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
                  {row.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                    {row.enrolledCourses}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'}`}>
                    {row.completedCourses}
                  </span>
                </td>
                <td className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {formatDate(row.lastActive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Page {currentPage} of {totalPages} ({studentData.length} students)
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

export default StudentReportTable
