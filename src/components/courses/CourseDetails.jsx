import React from 'react'
import { X, Globe, Clock, BookOpen } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function CourseDetails({ course, onClose }) {
  const { isDarkMode } = useTheme()

  if (!course) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-4 sm:p-6 border-b ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Course Details
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-slate-200'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Thumbnail */}
          <div className="mb-6 rounded-lg overflow-hidden h-40 sm:h-64 bg-gradient-to-br from-blue-400 to-purple-500">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="text-white" size={48} sm:size={64} opacity={0.5} />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
            {course.title}
          </h3>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <BookOpen className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={16} />
              <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                {course.mode}
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <Globe className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={16} />
              <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                {course.language}
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <Clock className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} size={16} />
              <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                {course.duration}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className={`my-6 h-px ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}></div>

          {/* Short Description */}
          <div className="mb-6">
            <h4 className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-2 uppercase tracking-wider`}>
              Overview
            </h4>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
              {course.shortDescription}
            </p>
          </div>

          {/* Full Description */}
          <div className="mb-6">
            <h4 className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-2 uppercase tracking-wider`}>
              Description
            </h4>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed whitespace-pre-line`}>
              {course.description}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-h-[44px] min-w-[120px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
