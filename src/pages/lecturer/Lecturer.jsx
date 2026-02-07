import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Eye, Edit, Trash2, Plus, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const STORAGE_KEY = 'moodle_lecturers_v1'

function Lecturer() {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  const [lecturers, setLecturers] = useState([])
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contact: '',
    mode: 'Online',
    subject: '',
    dob: '',
    address: '',
    regNumber: '',
  })
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setLecturers(JSON.parse(raw))
      } catch (e) {
        setLecturers([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lecturers))
  }, [lecturers])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.fullName.trim()) return 'Full Name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Enter a valid email.'
    if (!form.contact.trim()) return 'Contact Number is required.'
    if (!/^\d{7,15}$/.test(form.contact)) return 'Contact should be 7-15 digits (WhatsApp number).'
    if (!form.subject.trim()) return 'Subject is required.'
    if (!form.regNumber.trim()) return 'Registration Number is required.'
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    const newLecturer = { id: Date.now().toString(), ...form }
    setLecturers(prev => [newLecturer, ...prev])
    setForm({ fullName: '', email: '', contact: '', mode: 'Online', subject: '', dob: '', address: '', regNumber: '' })
    setShowAdd(false)
  }

  function handleDelete(id) {
    const l = lecturers.find(x => x.id === id)
    if (!l) return
    if (!window.confirm(`Delete lecturer "${l.fullName}"? This action cannot be undone.`)) return
    setLecturers(prev => prev.filter(x => x.id !== id))
    if (selected && selected.id === id) setSelected(null)
  }

  const lowered = query.trim().toLowerCase()
  const filtered = lecturers.filter(l => {
    if (!lowered) return true
    return (
      (l.fullName || '').toLowerCase().includes(lowered) ||
      (l.email || '').toLowerCase().includes(lowered) ||
      (l.contact || '').toLowerCase().includes(lowered) ||
      (l.subject || '').toLowerCase().includes(lowered)
    )
  })

  const total = lecturers.length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Lecturer Management</h1>
          <p className={`transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Manage and monitor all lecturer registrations</p>
        </div>

        <div className="mb-8">
          <div className={`border rounded-xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-blue-900/20' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
            <div className="flex items-start justify-between">
              <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-3 rounded-lg`}>
                <Users className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
              </div>
              <div className="text-right">
                <h3 className={`text-sm font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Total Lecturers</h3>
                <p className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={20} />
            <input type="text" placeholder="Search lecturers..." value={query} onChange={e => setQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
          </div>

          <button onClick={() => setShowAdd(true)} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} shadow-lg hover:shadow-xl`}>
            <Plus size={20} />
            Add Lecturer
          </button>
        </div>

        <div className={`border rounded-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Reg. Number</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Contact</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Mode</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Subject</th>
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((l) => (
                    <tr key={l.id} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{l.regNumber}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{l.fullName}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.email}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.contact}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${l.mode === 'Online' ? (isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700') : (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700')}`}>{l.mode}</span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.subject}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelected(l)} className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`} title="View">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => navigate(`/editlecturer/${l.id}`)} className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-indigo-900/30 text-indigo-400' : 'hover:bg-indigo-50 text-indigo-600'}`} title="Edit">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(l.id)} className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={`px-6 py-12 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No lecturers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`mt-4 flex justify-between items-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>Showing {filtered.length} of {total} lecturers</p>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
            <div className="bg-white dark:bg-slate-800 rounded w-11/12 max-w-2xl p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Add Lecturer</h2>
                <button onClick={() => setShowAdd(false)} className="text-gray-600">Close</button>
              </div>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact Number (WhatsApp only)</label>
                  <input name="contact" value={form.contact} onChange={handleChange} inputMode="numeric" className="mt-1 block w-full border rounded px-3 py-2" placeholder="Digits only" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Mode</label>
                    <select name="mode" value={form.mode} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                      <option>Online</option>
                      <option>Physical</option>
                      <option>Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Date of Birth</label>
                  <input name="dob" value={form.dob} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Registration Number</label>
                  <input name="regNumber" value={form.regNumber} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
            <div className="bg-white dark:bg-slate-800 rounded w-11/12 max-w-2xl p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Lecturer Details</h2>
                <button onClick={() => setSelected(null)} className="text-gray-600">Close</button>
              </div>
              <div className="mt-4 space-y-2">
                <div><strong>Name:</strong> {selected.fullName}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                <div><strong>Contact:</strong> {selected.contact}</div>
                <div><strong>Mode:</strong> {selected.mode}</div>
                <div><strong>Subject:</strong> {selected.subject}</div>
                <div><strong>Date of Birth:</strong> {selected.dob || '—'}</div>
                <div><strong>Address:</strong> {selected.address || '—'}</div>
                <div><strong>Registration Number:</strong> {selected.regNumber}</div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Lecturer