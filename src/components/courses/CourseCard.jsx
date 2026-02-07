import React from 'react'
import { Clock, Globe, BookOpen } from 'lucide-react'

function CourseCard({ course, onView }) {
  return (
    <div
      onClick={() => onView(course)}
      className="group cursor-pointer bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
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
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {course.mode}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {course.shortDescription}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Globe size={14} />
            {course.language}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Clock size={14} />
            {course.duration}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onView(course)
          }}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default CourseCard
