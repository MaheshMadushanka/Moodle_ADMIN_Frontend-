import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function CreateCourseModal({ onClose, onSubmit }) {
  const { isDarkMode } = useTheme()
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    thumbnail: '',
    mode: 'Online',
    language: 'English',
    duration: '4 weeks',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return alert('Course title is required.')
    if (!form.description.trim()) return alert('Course description is required.')
    if (!form.shortDescription.trim()) return alert('Short description is required.')

    onSubmit({
      ...form,
      id: Date.now().toString(),
    })

    setForm({
      title: '',
      description: '',
      shortDescription: '',
      thumbnail: '',
      mode: 'Online',
      language: 'English',
      duration: '4 weeks',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-6 border-b ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Create New Course
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Short Description *
            </label>
            <input
              type="text"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Brief description (1-2 lines)"
              maxLength={100}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Full Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter detailed course description"
              rows={4}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Mode *
              </label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option>Online</option>
                <option>Physical</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Language *
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
                <option>Japanese</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 4 weeks, 8 hours"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourseModal
