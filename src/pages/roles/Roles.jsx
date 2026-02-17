import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getAllRoles, createRole, updateRoleById, deleteRoleById } from '../../Api/Api';
import Swal from 'sweetalert2';

function Roles() {
  const { isDarkMode } = useTheme();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ position: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      if (response.data.status && response.data.result) {
        setRoles(response.data.result);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to fetch roles',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch roles';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    
    if (!formData.position.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Position name is required',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createRole(formData.position);
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Role created successfully',
          confirmButtonColor: '#3b82f6'
        });
        setFormData({ position: '' });
        setShowAddModal(false);
        fetchRoles();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to create role',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create role';
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

  const handleEditRole = async (e) => {
    e.preventDefault();
    
    if (!formData.position.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Position name is required',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updateRoleById(selectedRole.id, formData.position);
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Role updated successfully',
          confirmButtonColor: '#3b82f6'
        });
        setFormData({ position: '' });
        setShowEditModal(false);
        setSelectedRole(null);
        fetchRoles();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to update role',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update role';
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

  const handleDeleteRole = async (id, position) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Role',
      text: `Are you sure you want to delete the "${position}" role? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const response = await deleteRoleById(id);
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Role deleted successfully',
          confirmButtonColor: '#3b82f6'
        });
        fetchRoles();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to delete role',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete role';
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

  const handleOpenEdit = (role) => {
    setSelectedRole(role);
    setFormData({ position: role.position });
    setShowEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({ position: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({ position: '' });
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(role =>
    role.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          } mb-2`}>
            Role Management
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Create and manage user roles in the system
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
              <div className={`${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'} p-3 rounded-lg`}>
                <Briefcase className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
              </div>
              <div className="text-right">
                <h3 className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Total Roles
                </h3>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {roles.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } shadow-lg hover:shadow-xl`}
          >
            <Plus size={20} />
            Add Role
          </button>
        </div>

        {/* Roles Grid */}
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
                    ID
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Position
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Created
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Updated
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading && filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-6 py-8 text-center text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Loading roles...
                    </td>
                  </tr>
                ) : filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <tr 
                      key={role.id}
                      className={`transition-colors duration-150 ${
                        isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className={`px-6 py-4 text-sm font-medium ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        #{role.id}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {role.position}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {new Date(role.createdAt).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {new Date(role.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(role)}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                              isDarkMode
                                ? 'hover:bg-blue-900/30 text-blue-400'
                                : 'hover:bg-blue-50 text-blue-600'
                            }`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id, role.position)}
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
                    <td colSpan="5" className={`px-6 py-12 text-center text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Role Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Add New Role
                </h2>
                <button
                  onClick={handleCloseAddModal}
                  disabled={loading}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddRole} className="space-y-4">
                <div>
                  <label htmlFor="position" className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Position Name *
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ position: e.target.value })}
                    placeholder="e.g., Lecturer, Student, Admin"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 ${
                      isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedRole && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6`}>
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Edit Role
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  disabled={loading}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditRole} className="space-y-4">
                <div>
                  <label htmlFor="editPosition" className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Position Name *
                  </label>
                  <input
                    type="text"
                    id="editPosition"
                    value={formData.position}
                    onChange={(e) => setFormData({ position: e.target.value })}
                    placeholder="e.g., Lecturer, Student, Admin"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 ${
                      isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Roles;
