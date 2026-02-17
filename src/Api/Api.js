import axios from 'axios';

//const API_BASE_URL = 'http://13.203.160.138:8070/api'; // Change this to your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Endpoints
export const loginUser = (email, password) => 
  api.post('/user/userLogin', { email, password });

export const sendOTP = (email) => 
  api.post('/user/sendOTP', { email });

export const resetPassword = (email, otp, newPassword) =>
  api.post('/user/resetPassword', { email, otp, newPassword });

// Student Endpoints
export const registerStudent = (studentData) =>
  api.post('/student/registerStudent', {
    full_name: studentData.fullName,
    phone: studentData.contact,
    address: studentData.address,
    mode: studentData.mode.toLowerCase(),
    dob: studentData.dob,
    reg_number: studentData.registrationNumber,
    batch_number: studentData.batchNumber,
    email: studentData.email,
    role_id: studentData.roleId || 2
  });

export const getAllStudents = () =>
  api.get('/student/getAllStudent');

export const getStudentById = (id) =>
  api.get(`/student/getStudentById/${id}`);

export const updateStudentById = (id, studentData) =>
  api.put(`/student/updateStudentById/${id}`, {
    full_name: studentData.fullName,
    phone: studentData.contact,
    address: studentData.address,
    mode: studentData.mode.toLowerCase(),
    dob: studentData.dob,
    reg_number: studentData.registrationNumber,
    batch_number: studentData.batchNumber,
    email: studentData.email
  });

export const deleteStudentById = (id) =>
  api.delete(`/student/deleteStudentById/${id}`);

export const updateStudentAccountStatus = (id, status) =>
  api.put(`/student/updateAccountStatusById/${id}`, { account_status: status });

// Lecturer Endpoints
export const registerLecturer = (lecturerData) =>
  api.post('/lecture/registerLecture', {
    full_name: lecturerData.fullName,
    phone: lecturerData.contact,
    address: lecturerData.address,
    mode: lecturerData.mode.toLowerCase(),
    dob: lecturerData.dob,
    reg_number: lecturerData.regNumber,
    nic: lecturerData.nic || '',
    email: lecturerData.email,
    subject: lecturerData.subject || '',
    role_id: lecturerData.roleId || 1
  });

export const getAllLecturers = () =>
  api.get('/lecture/getAllLecture');

export const getLecturerById = (id) =>
  api.get(`/lecture/getLectureById/${id}`);

export const updateLecturerById = (id, lecturerData) =>
  api.put(`/lecture/updateLectureById/${id}`, {
    full_name: lecturerData.fullName,
    phone: lecturerData.contact,
    address: lecturerData.address,
    mode: lecturerData.mode.toLowerCase(),
    dob: lecturerData.dob,
    reg_number: lecturerData.regNumber,
    nic: lecturerData.nic || '',
    email: lecturerData.email
  });

export const deleteLecturerById = (id) =>
  api.delete(`/lecture/deleteLectureById/${id}`);

export const updateLecturerAccountStatus = (id, status) =>
  api.put(`/lecture/updateAccountStatusById/${id}`, { account_status: status });

// Admin Endpoints
export const getAllAdmins = () =>
  api.get('/admin/getAllAdmin');

export const deleteAdminById = (id) =>
  api.delete(`/admin/deleteAdminById/${id}`);

export const updateAdminById = (id, adminData) =>
  api.put(`/admin/updateAdminById/${id}`, adminData);

// Role Endpoints
export const createRole = (position) =>
  api.post('/role/create', { position });

export const getAllRoles = () =>
  api.get('/role/getAll');

export const updateRoleById = (id, position) =>
  api.put(`/role/updateById/${id}`, { position });

export const deleteRoleById = (id) =>
  api.delete(`/role/deleteById/${id}`);

export default api; 

