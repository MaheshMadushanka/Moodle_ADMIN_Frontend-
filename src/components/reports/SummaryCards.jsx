import React from 'react'
import { BookOpen, Users, UserCheck, ClipboardList } from 'lucide-react'

function SummaryCards({ stats, isDarkMode }) {
  const cards = [
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Instructors',
      value: stats.totalInstructors,
      icon: UserCheck,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: ClipboardList,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`border rounded-xl p-6 transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-slate-700/50'
                : 'bg-white border-slate-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {card.label}
                </p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`${card.iconColor}`} size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
