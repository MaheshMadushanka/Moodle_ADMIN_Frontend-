import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getAllStudents, deleteStudentById, updateStudentAccountStatus, getAllUsers, changePasswordByUserId, updateStudent, updateEmailByStudentId, getAllRoles } from '../../Api/Api';
import Swal from 'sweetalert2';

function Student() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    mode: '',
    dob: '',
    reg_number: '',
    email: '',
    role_id: '',
  });
  const [editPassword, setEditPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Fetch students & roles on component mount
  useEffect(() => {
    fetchStudents();
    fetchRoles();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getAllStudents();
      const list = (response?.data?.result) || (response?.data) || response || [];

      // fetch users once and map by id to avoid n+1 requests
      try {
        const usersRes = await getAllUsers(1, 10000);
        const usersList = (usersRes?.data?.result) || (usersRes?.data) || usersRes || [];
        const usersMap = new Map();
        usersList.forEach((u) => usersMap.set(u.id, u));

        const merged = (Array.isArray(list) ? list : []).map((s) => {
          const user = usersMap.get(s.user_id) || usersMap.get(s.userId) || null;
          return {
            ...s,
            user_email: user?.email || s.email || '',
          };
        });

        setStudents(merged);
      } catch (uErr) {
        console.error('Failed to fetch users for email mapping', uErr);
        setStudents(Array.isArray(list) ? list : []);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch students';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = students.length;

  const filteredStudents = students.filter(student =>
    (student.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.reg_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.batch_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      if (response.data.status && response.data.result) {
        setRoles(response.data.result);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setEditFormData({
      full_name: student.full_name || '',
      phone: student.phone || '',
      address: student.address || '',
      mode: student.mode || '',
      dob: student.dob ? student.dob.split('T')[0] : '',
      reg_number: student.reg_number || '',
      email: student.user_email || '',
      role_id: student.role_id || student.roleId || '',
    });
    setEditPassword('');
    setEditConfirmPassword('');
    setShowEditModal(true);
  };

  const handleDelete = async (studentId, studentName) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Student',
      text: `Are you sure you want to delete "${studentName}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const response = await deleteStudentById(studentId);
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Student deleted successfully',
          confirmButtonColor: '#3b82f6'
        });
        fetchStudents();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to delete student',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete student';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, currentStatus, studentName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setLoading(true);
    try {
      const response = await updateStudentAccountStatus(studentId, newStatus);
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: `Student status changed to ${newStatus}`,
          confirmButtonColor: '#3b82f6'
        });
        fetchStudents();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to update status',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update status';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

    const handleSaveEdit = async () => {
      if (!editStudent) return;

      // basic validation
      if (editFormData.email && !/\S+@\S+\.\S+/.test(editFormData.email)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Email is invalid', confirmButtonColor: '#ef4444' });
        return;
      }
      if (editFormData.role_id === '' || editFormData.role_id == null) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Role must be selected', confirmButtonColor: '#ef4444' });
        return;
      }

      setEditLoading(true);
      try {
        const userId = editStudent.id ;
        let anySuccess = false;

        // 1. update student fields if changed
        const studentUpdates = {
          full_name: editFormData.full_name,
          phone: editFormData.phone,
          address: editFormData.address,
          mode: editFormData.mode,
          dob: editFormData.dob,
          reg_number: editFormData.reg_number,
          role_id: editFormData.role_id,
        };
        console.debug('Saving edit for student id', editStudent.id, 'payload', studentUpdates, 'emailChange', editFormData.email !== (editStudent.user_email || ''));

        const changedStudent = Object.keys(studentUpdates).some(
          (k) => studentUpdates[k] !== (editStudent[k] || '')
        );

        if (changedStudent) {
          const studentId = editStudent.id || editStudent.student_id || editStudent.studentId;
        if (!studentId) {
          throw new Error('Missing student identifier');
        }
        const resp = await updateStudent(studentId, studentUpdates);
          if (resp?.data?.status) {
            anySuccess = true;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: resp?.data?.message || 'Failed to update student info', confirmButtonColor: '#ef4444' });
          }
        }

        // 2. update email separately if changed
        if (
          editFormData.email &&
          editFormData.email !== (editStudent.user_email || '')
        ) {
          const resp2 = await updateEmailByStudentId(userId, editFormData.email);
          if (resp2?.data?.status) {
            anySuccess = true;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: resp2?.data?.message || 'Failed to update email', confirmButtonColor: '#ef4444' });
          }
        }

        // 3. optionally change password if provided
        if (editPassword) {
          if (editPassword !== editConfirmPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match', confirmButtonColor: '#ef4444' });
            setEditLoading(false);
            return;
          }
          if (editPassword.length < 6) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Password must be at least 6 characters', confirmButtonColor: '#ef4444' });
            setEditLoading(false);
            return;
          }
          const passResp = await changePasswordByUserId(userId, editPassword);
          if (passResp?.data?.status) {
            anySuccess = true;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: passResp?.data?.message || 'Failed to change password', confirmButtonColor: '#ef4444' });
          }
        }

        if (anySuccess) {
          Swal.fire({ icon: 'success', title: 'Updated', text: 'Student record updated successfully', confirmButtonColor: '#3b82f6' });
          fetchStudents();
          setShowEditModal(false);
          setEditStudent(null);
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to update student';
        Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#ef4444' });
        console.error('Error saving edits:', err);
      } finally {
        setEditLoading(false);
      }
    };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          } mb-2`}>
            Student Management
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Manage and monitor all student registrations
          </p>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <div 
            className={`border rounded-xl p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-blue-900/20' 
                : 'bg-white border-slate-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-3 rounded-lg`}>
                <Users className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
              </div>
              <div className="text-right">
                <h3 className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Total Students
                </h3>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`} size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          <button
            onClick={() => navigate('/addstudent')}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } shadow-lg hover:shadow-xl`}
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>

        {/* Students Table */}
        <div className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Reg. Number
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Full Name
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Contact
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Mode
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Email
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className={`px-6 py-8 text-center text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id}
                      className={`transition-colors duration-150 ${
                        isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className={`px-6 py-4 text-sm font-medium ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {student.reg_number}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {student.full_name}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {student.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (student.mode || '').toLowerCase() === 'online'
                            ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                        }`}>
                          {student.mode}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {student.email || student.user_email}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusChange(student.id, student.account_status, student.full_name)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${
                            student.account_status === 'active'
                              ? isDarkMode ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50' : 'bg-green-50 text-green-700 hover:bg-green-100'
                              : isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {student.account_status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(student)}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                              isDarkMode
                                ? 'hover:bg-blue-900/30 text-blue-400'
                                : 'hover:bg-blue-50 text-blue-600'
                            }`}
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                              isDarkMode
                                ? 'hover:bg-indigo-900/30 text-indigo-400'
                                : 'hover:bg-indigo-50 text-indigo-600'
                            }`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.full_name)}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                              isDarkMode
                                ? 'hover:bg-red-900/30 text-red-400'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan="7" 
                      className={`px-6 py-12 text-center text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination or additional info can go here */}
        <div className={`mt-4 flex justify-between items-center text-sm ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <p>
            Showing {filteredStudents.length} of {totalStudents} students
          </p>
        </div>

        {/* Student Details Modal */}
        {showDetailsModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Student Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  ✕
                </button>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Registration Number</p>
                  <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.reg_number}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</p>
                  <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.full_name}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{new Date(selectedStudent.dob).toLocaleDateString()}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Address</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.address}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mode</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.mode}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.email || selectedStudent.user_email}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Account Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                    selectedStudent.account_status === 'active'
                      ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                      : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                  }`}>
                    {selectedStudent.account_status}
                  </span>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>User ID</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.user_id}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Created</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{new Date(selectedStudent.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Student Modal (password change) */}
        {showEditModal && editStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Student</h2>
                <button onClick={() => setShowEditModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>✕</button>
              </div>

              <div className="space-y-4">
                {/* editable student fields */}
                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                  <input
                    type="text"
                    value={editFormData.full_name}
                    onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mode</label>
                  <select
                    value={editFormData.mode}
                    onChange={(e) => setEditFormData({...editFormData, mode: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    <option value="">Select mode</option>
                    <option value="online">online</option>
                    <option value="physical">physical</option>
                    <option value="hybrid">hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Role</label>
                  <select
                    value={editFormData.role_id}
                    onChange={(e) => setEditFormData({...editFormData, role_id: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    <option value="">Select role</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dob}
                    onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Address</label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    rows="2"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Registration Number</label>
                  <input
                    type="text"
                    value={editFormData.reg_number}
                    onChange={(e) => setEditFormData({...editFormData, reg_number: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                {/* password fields still optional */}
                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>New Password</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Confirm Password</label>
                  <input
                    type="password"
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className={`px-4 py-2 rounded-lg font-medium text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;