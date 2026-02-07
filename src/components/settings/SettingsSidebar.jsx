import React from 'react'
import { Settings, BookOpen, Users, CreditCard, Mail, Zap } from 'lucide-react'

const SECTIONS = [
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'course', label: 'Course Settings', icon: BookOpen },
  { id: 'user', label: 'User Settings', icon: Users },
  { id: 'payment', label: 'Payment Settings', icon: CreditCard },
  { id: 'email', label: 'Email Settings', icon: Mail },
  { id: 'platform', label: 'Platform Settings', icon: Zap },
]

function SettingsSidebar({ activeSection, onSectionChange, isDarkMode }) {
  return (
    <div className={`flex flex-col gap-2 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <h3 className={`text-sm font-semibold px-3 py-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
        Settings
      </h3>
      {SECTIONS.map(section => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : isDarkMode
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{section.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SettingsSidebar
export { SECTIONS }
