import React, { useState } from 'react';
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

function Student() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample student data
  const studentsData = [
    {
      id: 1,
      regNumber: 'STU2024001',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      contact: '+94 77 123 4567',
      mode: 'Online',
      batchNumber: 'B2024-A',
      dob: '1998-05-15',
      address: '123 Main St, Colombo'
    },
    {
      id: 2,
      regNumber: 'STU2024002',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      contact: '+94 76 234 5678',
      mode: 'Physical',
      batchNumber: 'B2024-B',
      dob: '1999-08-22',
      address: '456 Lake Rd, Kandy'
    },
    {
      id: 3,
      regNumber: 'STU2024003',
      fullName: 'Michael Johnson',
      email: 'michael.j@example.com',
      contact: '+94 75 345 6789',
      mode: 'Online',
      batchNumber: 'B2024-A',
      dob: '1997-12-10',
      address: '789 Beach Ave, Galle'
    },
    {
      id: 4,
      regNumber: 'STU2024004',
      fullName: 'Emily Brown',
      email: 'emily.brown@example.com',
      contact: '+94 74 456 7890',
      mode: 'Physical',
      batchNumber: 'B2024-C',
      dob: '2000-03-18',
      address: '321 Hill St, Negombo'
    },
    {
      id: 5,
      regNumber: 'STU2024005',
      fullName: 'David Wilson',
      email: 'david.wilson@example.com',
      contact: '+94 73 567 8901',
      mode: 'Online',
      batchNumber: 'B2024-B',
      dob: '1998-11-25',
      address: '654 Park Lane, Jaffna'
    }
  ];

  const totalStudents = studentsData.length;

  const filteredStudents = studentsData.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (studentId) => {
    navigate(`/studentview/${studentId}`);
  };

  const handleEdit = (studentId) => {
    navigate(`/editstudent/${studentId}`);
  };

  const handleDelete = (studentId) => {
    // Add delete confirmation logic here
    if (window.confirm('Are you sure you want to delete this student?')) {
      console.log('Delete student:', studentId);
      // Add your delete logic here
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
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
                    Email
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
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredStudents.length > 0 ? (
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
                        {student.regNumber}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {student.fullName}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {student.email}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {student.contact}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.mode === 'Online'
                            ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                        }`}>
                          {student.mode}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {student.batchNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(student.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
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
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isDarkMode
                                ? 'hover:bg-indigo-900/30 text-indigo-400'
                                : 'hover:bg-indigo-50 text-indigo-600'
                            }`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
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
      </div>
    </div>
  );
}

export default Student;