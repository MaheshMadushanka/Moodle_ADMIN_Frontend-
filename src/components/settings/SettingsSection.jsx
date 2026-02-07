import React from 'react'

function SettingsSection({ title, description, children, isDarkMode }) {
  return (
    <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className={`mb-6 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  )
}

export default SettingsSection
