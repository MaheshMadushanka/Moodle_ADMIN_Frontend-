import React from 'react'

export function FormInput({ label, name, type = 'text', value, onChange, placeholder, isDarkMode, required = false }) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
    </div>
  )
}

export function FormSelect({ label, name, value, onChange, options, isDarkMode, required = false }) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      >
        <option value="">-- Select {label} --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function FormToggle({ label, name, checked, onChange, isDarkMode, description }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          {label}
        </label>
        {description && (
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange({ target: { name, checked: !checked } })}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></span>
      </button>
    </div>
  )
}

export function FormTextarea({ label, name, value, onChange, placeholder, isDarkMode, required = false, rows = 4 }) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
    </div>
  )
}

export function FormColorPicker({ label, name, value, onChange, isDarkMode }) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          name={name}
          value={value}
          onChange={onChange}
          className={`h-12 w-20 cursor-pointer rounded border ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
      </div>
    </div>
  )
}

export function FormButtonGroup({ onSave, onCancel, isDarkMode, isLoading = false }) {
  return (
    <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex justify-end gap-3`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
        >
          Cancel
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} bg-blue-600 text-white`}
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
