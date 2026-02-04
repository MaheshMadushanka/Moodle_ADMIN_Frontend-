import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Hash,
  Monitor,
  Users as UsersIcon,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function AddStudents() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    mode: '',
    batchNumber: '',
    dob: '',
    address: '',
    registrationNumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^(\+94|0)?[0-9]{9,10}$/.test(formData.contact.replace(/\s/g, ''))) {
      newErrors.contact = 'Valid WhatsApp number is required';
    }

    if (!formData.mode) {
      newErrors.mode = 'Please select a mode';
    }

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Student has been added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#f1f5f9' : '#0f172a',
        customClass: {
          popup: isDarkMode ? 'dark-popup' : '',
          confirmButton: 'custom-confirm-button'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate back to students page
          navigate('/students');
        }
      });
    } else {
      // Show error alert
      Swal.fire({
        title: 'Oops!',
        text: 'Please fill in all required fields correctly',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#f1f5f9' : '#0f172a',
        customClass: {
          popup: isDarkMode ? 'dark-popup' : ''
        }
      });
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
    isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-600' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-slate-50'
  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`;

  const labelClass = `block text-sm font-semibold mb-2 transition-colors duration-300 ${
    isDarkMode ? 'text-slate-200' : 'text-slate-700'
  }`;

  const errorClass = 'text-red-500 text-xs mt-1 flex items-center gap-1';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/students')}
            className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <ArrowLeft size={16} />
            Back to Students
          </button>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          } mb-2`}>
            Add New Student
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Fill in the student registration details below
          </p>
        </div>

        {/* Form Card */}
        <div className={`border rounded-2xl p-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700 shadow-2xl shadow-blue-900/10' 
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
        }`}>
          <form onSubmit={handleSubmit}>
            {/* Student Information Section */}
            <div className="mb-8">
              <h2 className={`text-xl font-bold mb-6 pb-3 border-b transition-colors duration-300 ${
                isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'
              }`}>
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Full Name *
                    </div>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    className={inputClass}
                  />
                  {errors.fullName && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Email Address *
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      WhatsApp Number *
                    </div>
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className={inputClass}
                  />
                  {errors.contact && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.contact}
                    </p>
                  )}
                </div>

                {/* Mode */}
                <div>
                  <label htmlFor="mode" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <Monitor size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Mode *
                    </div>
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select mode</option>
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                  </select>
                  {errors.mode && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.mode}
                    </p>
                  )}
                </div>

                {/* Batch Number */}
                <div>
                  <label htmlFor="batchNumber" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <UsersIcon size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Batch Number *
                    </div>
                  </label>
                  <input
                    type="text"
                    id="batchNumber"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="B2024-A"
                    className={inputClass}
                  />
                  {errors.batchNumber && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.batchNumber}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Date of Birth *
                    </div>
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.dob && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.dob}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Address *
                    </div>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                    className={inputClass}
                  />
                  {errors.address && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.address}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div className="md:col-span-2">
                  <label htmlFor="registrationNumber" className={labelClass}>
                    <div className="flex items-center gap-2">
                      <Hash size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      Registration Number *
                    </div>
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="STU2024001"
                    className={inputClass}
                  />
                  {errors.registrationNumber && (
                    <p className={errorClass}>
                      <span>⚠</span> {errors.registrationNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30'
                }`}
              >
                <Save size={20} />
                Add Student
              </button>
              <button
                type="button"
                onClick={() => navigate('/students')}
                className={`px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom styles for SweetAlert dark mode */}
      <style jsx global>{`
        .dark-popup {
          border: 1px solid #334155 !important;
        }
        
        .custom-confirm-button {
          padding: 10px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        .swal2-popup {
          border-radius: 16px !important;
        }

        .swal2-title {
          font-size: 24px !important;
          font-weight: 700 !important;
        }

        .swal2-html-container {
          font-size: 16px !important;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fadeOutUp {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
        }

        .animate__animated {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }

        .animate__faster {
          animation-duration: 0.5s;
        }

        .animate__fadeInDown {
          animation-name: fadeInDown;
        }

        .animate__fadeOutUp {
          animation-name: fadeOutUp;
        }
      `}</style>
    </div>
  );
}

export default AddStudents;