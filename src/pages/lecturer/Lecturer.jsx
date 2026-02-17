import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Eye, Edit, Trash2, Plus, Search, X, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getAllLecturers, registerLecturer, deleteLecturerById, getAllRoles } from '../../Api/Api'
import Swal from 'sweetalert2'

const STORAGE_KEY = 'moodle_lecturers_v1'

function Lecturer() {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contact: '',
    mode: 'Online',
    subject: '',
    dob: '',
    address: '',
    regNumber: '',
    nic: '',
    roleId: 1,
  })
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Fetch lecturers and roles on component mount
  useEffect(() => {
    fetchLecturers()
    fetchRoles()
  }, [])

  // Save to localStorage whenever lecturers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lecturers))
  }, [lecturers])

  const fetchLecturers = async () => {
    setLoading(true)
    try {
      const response = await getAllLecturers()
      if (response.data.status && response.data.result) {
        setLecturers(response.data.result)
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error)
      // Load from localStorage if API fails
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setLecturers(JSON.parse(saved))
        } catch (e) {
          setLecturers([])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles()
      if (response.data.status && response.data.result) {
        setRoles(response.data.result)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

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
    if (!form.dob) return 'Date of Birth is required.'
    if (!form.address.trim()) return 'Address is required.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: err,
        confirmButtonColor: '#f59e0b'
      })
      return
    }

    setLoading(true)
    try {
      const response = await registerLecturer(form)
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Lecturer added successfully',
          confirmButtonColor: '#3b82f6'
        })
        setForm({ fullName: '', email: '', contact: '', mode: 'Online', subject: '', dob: '', address: '', regNumber: '', nic: '', roleId: 1 })
        setShowAdd(false)
        fetchLecturers()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to add lecturer',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add lecturer'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const l = lecturers.find(x => x.id === id)
    if (!l) return
    
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Lecturer',
      text: `Are you sure you want to delete "${l.full_name || l.fullName}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete'
    })

    if (!result.isConfirmed) return

    setLoading(true)
    try {
      const response = await deleteLecturerById(id)
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Lecturer deleted successfully',
          confirmButtonColor: '#3b82f6'
        })
        setLecturers(prev => prev.filter(x => x.id !== id))
        if (selected && selected.id === id) setSelected(null)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to delete lecturer',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete lecturer'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const lowered = query.trim().toLowerCase()
  const filtered = lecturers.filter(l => {
    if (!lowered) return true
    const fullName = l.full_name || l.fullName || ''
    const email = l.email || ''
    const contact = l.phone || l.contact || ''
    const subject = l.subject || ''
    return (
      fullName.toLowerCase().includes(lowered) ||
      email.toLowerCase().includes(lowered) ||
      contact.toLowerCase().includes(lowered) ||
      subject.toLowerCase().includes(lowered)
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

        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={20} />
            <input type="text" placeholder="Search lecturers..." value={query} onChange={e => setQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
          </div>

          <button onClick={() => setShowAdd(true)} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 min-h-[44px] ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} shadow-lg hover:shadow-xl whitespace-nowrap`}>
            <Plus size={20} />
            <span className="hidden sm:inline">Add Lecturer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className={`border rounded-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Reg. #</th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name</th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email</th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Contact</th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Mode</th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Subject</th>
                  <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((l) => (
                    <tr key={l.id} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                      <td className={`px-4 py-3 text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{l.reg_number || l.regNumber}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{l.full_name || l.fullName}</td>
                      <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.email}</td>
                      <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.phone || l.contact}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${(l.mode || l.mode) === 'online' ? (isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700') : (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700')}`}>{l.mode || 'Online'}</span>
                      </td>
                      <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{l.subject}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setSelected(l)} disabled={loading} className={`p-1.5 rounded transition-colors duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50 ${isDarkMode ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`} title="View">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(l.id)} disabled={loading} className={`p-1.5 rounded transition-colors duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50 ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={`px-4 py-12 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{loading ? 'Loading...' : 'No lecturers found'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden p-4 space-y-4">
            {filtered.length > 0 ? (
              filtered.map((l) => (
                <div key={l.id} className={`p-4 border rounded-lg ${isDarkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{l.full_name || l.fullName}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{l.reg_number || l.regNumber}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${(l.mode || '').toLowerCase() === 'online' ? (isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700') : (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700')}`}>
                      {l.mode || 'Online'}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs mb-4">
                    <p><strong>Email:</strong> <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{l.email}</span></p>
                    <p><strong>Contact:</strong> <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{l.phone || l.contact}</span></p>
                    <p><strong>Subject:</strong> <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{l.subject}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(l)} disabled={loading} className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                      View
                    </button>
                    <button onClick={() => handleDelete(l.id)} disabled={loading} className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {loading ? 'Loading...' : 'No lecturers found'}
              </div>
            )}
          </div>
        </div>

        <div className={`mt-4 flex justify-between items-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>Showing {filtered.length} of {total} lecturers</p>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4 sm:p-0">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Lecturer</h2>
                <button onClick={() => setShowAdd(false)} className={`p-1.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100'}`}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Contact Number (WhatsApp)</label>
                  <input name="contact" value={form.contact} onChange={handleChange} inputMode="numeric" placeholder="Digits only" className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Mode</label>
                    <select name="mode" value={form.mode} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}>
                      <option>Online</option>
                      <option>Physical</option>
                      <option>Both</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Role</label>
                  <select name="roleId" value={form.roleId} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}>
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.position}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Date of Birth</label>
                  <input name="dob" value={form.dob} onChange={handleChange} type="date" className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={2} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Registration Number</label>
                  <input name="regNumber" value={form.regNumber} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>NIC (National ID)</label>
                  <input name="nic" value={form.nic} onChange={handleChange} placeholder="Optional" className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} />
                </div>
                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <button type="button" onClick={() => setShowAdd(false)} disabled={loading} className={`px-6 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors min-h-[44px] disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4 sm:p-0">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lecturer Details</h2>
                <button onClick={() => setSelected(null)} className={`p-1.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100'}`}>
                  <X size={20} />
                </button>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Name</p>
                  <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selected.full_name || selected.fullName}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Reg. Number</p>
                  <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{selected.reg_number || selected.regNumber}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} break-all`}>{selected.email}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Contact</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.phone || selected.contact}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mode</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.mode || 'Online'}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Subject</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.subject}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.dob || '—'}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Address</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.address || '—'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-h-[44px] min-w-[120px]">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Lecturer