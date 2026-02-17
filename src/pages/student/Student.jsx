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
import { getAllStudents, deleteStudentById, updateStudentAccountStatus } from '../../Api/Api';
import Swal from 'sweetalert2';

function Student() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getAllStudents();
      if (response.data.status && response.data.result) {
        setStudents(response.data.result);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to fetch students',
          confirmButtonColor: '#ef4444'
        });
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

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleEdit = (studentId) => {
    navigate(`/editstudent/${studentId}`);
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
                    Batch
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
                        {student.batch_number}
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
                            onClick={() => handleEdit(student.id)}
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
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Batch Number</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.batch_number}</p>
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
      </div>
    </div>
  );
}

export default Student;