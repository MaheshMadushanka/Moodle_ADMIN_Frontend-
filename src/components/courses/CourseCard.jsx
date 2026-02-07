import React from 'react'
import { Clock, Globe, BookOpen } from 'lucide-react'

function CourseCard({ course, onView }) {
  return (
    <div
      onClick={() => onView(course)}
      className="group cursor-pointer bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700 h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-white" size={48} opacity={0.5} />
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
          {course.mode}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 flex-grow">
          {course.shortDescription}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Globe size={12} className="hidden sm:block" />
            <Globe size={10} className="sm:hidden" />
            {course.language}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Clock size={12} className="hidden sm:block" />
            <Clock size={10} className="sm:hidden" />
            {course.duration}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onView(course)
          }}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors duration-200 min-h-[44px] text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default CourseCard
