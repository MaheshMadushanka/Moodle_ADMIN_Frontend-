import React from 'react'
import { Filter, Download } from 'lucide-react'

function FiltersBar({ filters, onFilterChange, onExportCSV, onExportPDF, isDarkMode }) {
  return (
    <div className={`border rounded-lg p-6 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Filter Icon Label */}
        <div className="flex items-center gap-2 mb-2 lg:mb-0">
          <Filter size={20} className={isDarkMode ? 'text-slate-400' : 'text-slate-600'} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Filters
          </span>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col">
          <label className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        <div className="flex flex-col">
          <label className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        {/* Course Filter */}
        <div className="flex flex-col">
          <label className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Course
          </label>
          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="">All Courses</option>
            <option value="course1">BIT Student Matters</option>
            <option value="course2">Administrative Matters</option>
            <option value="course3">Orientation 24In2</option>
          </select>
        </div>

        {/* Instructor Filter */}
        <div className="flex flex-col">
          <label className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Instructor
          </label>
          <select
            value={filters.instructor}
            onChange={(e) => onFilterChange('instructor', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="">All Instructors</option>
            <option value="instructor1">Dr. John Smith</option>
            <option value="instructor2">Prof. Jane Doe</option>
            <option value="instructor3">Mr. Alex Johnson</option>
          </select>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 lg:ml-auto">
          <button
            onClick={onExportCSV}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
          >
            <Download size={16} />
            CSV
          </button>
          <button
            onClick={onExportPDF}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
          >
            <Download size={16} />
            PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersBar
