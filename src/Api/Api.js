import axios from "axios";

/* =====================================================
   AXIOS CONFIG
===================================================== */

const API_BASE_URL = "http://3.109.1.245:9999/api";
// Files (images/CV/etc) are served from the server root, not the /api prefix
const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const getImageUrl = (path) => {
  if (!path) return "";
  // If it's already an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // Ensure path starts with '/'
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${FILE_BASE_URL}${p}`;
};

/* =====================================================
   INTERCEPTORS
===================================================== */

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout if unauthorized
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* =====================================================
   ENDPOINT PATHS
===================================================== */

const EP = {
  USER: "/user",
  STUDENT: "/student",
  LECTURER: "/lecture",
  ADMIN: "/admin",
  ROLE: "/role",
  COURSE: "/course",
  COURSE_LECTURER: "/course_lecturer",
};

/* =====================================================
   USER / AUTH
===================================================== */

export const loginUser = (email, password) =>
  api.post(`${EP.USER}/userLogin`, { email, password });

export const sendOTP = (email) =>
  api.post(`${EP.USER}/sendOTP`, { email });

export const validateOTPForFPW = (email, enteredOTP, newPassword) =>
  api.put(`${EP.USER}/validateOTPForFPW`, {
    email,
    enteredOTP,
    newPassword,
  });

export const getAllUsers = (page = 1, limit = 10) =>
  api.get(`${EP.USER}/getAllUser`, { params: { page, limit } });

export const getUserById = (id) =>
  api.get(`${EP.USER}/getUserById/${id}`);

export const changePasswordByUserId = (user_id, newPassword) =>
  api.put(`${EP.USER}/changePasswordByUserId`, {
    user_id,
    newPassword,
  });

/* =====================================================
   ROLE API
===================================================== */

export const createRole = (position) =>
  api.post(`${EP.ROLE}/create`, { position });

export const getAllRoles = (page = 1, limit = 10) =>
  api.get(`${EP.ROLE}/getAll`, { params: { page, limit } });

export const getRoleById = (id) =>
  api.get(`${EP.ROLE}/getById/${id}`);

export const updateRoleById = (id, position) =>
  api.put(`${EP.ROLE}/updateById/${id}`, { position });

export const deleteRoleById = (id) =>
  api.delete(`${EP.ROLE}/deleteById/${id}`);

/* =====================================================
   COURSE API
===================================================== */

export const createCourse = (name) =>
  api.post(`${EP.COURSE}/create`, { name });

export const getAllCourses = (page = 1, limit = 10) =>
  api.get(`${EP.COURSE}/getAll`, { params: { page, limit } });

export const getCourseById = (id) =>
  api.get(`${EP.COURSE}/getById/${id}`);

export const updateCourse = (id, name) =>
  api.put(`${EP.COURSE}/updateById/${id}`, { name });

export const deleteCourse = (id) =>
  api.delete(`${EP.COURSE}/deleteById/${id}`);

export const updateCourseImageById = (id, file) => {
  const fd = new FormData();
  fd.append("image", file);

  return api.put(`${EP.COURSE}/updateImageById/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =====================================================
   COURSE - LECTURER
===================================================== */

export const assignCoursesToLecturer = (lecturer_id, courses) =>
  api.post(`${EP.COURSE_LECTURER}/create`, {
    lecturer_id,
    courses,
  });

export const getCourseLecturerById = (id) =>
  api.get(`${EP.COURSE_LECTURER}/getById/${id}`);

export const getByLecturerId = (id) =>
  api.get(`${EP.COURSE_LECTURER}/getByLecturerId/${id}`);

export const getByCourseId = (id) =>
  api.get(`${EP.COURSE_LECTURER}/getByCourseId/${id}`);

export const getAllCourseLecturer = (page = 1, limit = 10) =>
  api.get(`${EP.COURSE_LECTURER}/getAll`, {
    params: { page, limit },
  });

export const updateCourseLecturer = (id, course_id, lecturer_id) =>
  api.put(`${EP.COURSE_LECTURER}/updateById/${id}`, {
    course_id,
    lecturer_id,
  });

export const deleteCourseLecturer = (id) =>
  api.delete(`${EP.COURSE_LECTURER}/deleteById/${id}`);

/* =====================================================
   ADMIN API
===================================================== */

export const registerAdmin = (data) =>
  api.post(`${EP.ADMIN}/registerAdmin`, data);

export const getAdmins = (page = 1, limit = 10) =>
  api.get(`${EP.ADMIN}/getAllAdmin`, { params: { page, limit } });

export const getAdminById = (id) =>
  api.get(`${EP.ADMIN}/getAdminById/${id}`);

export const updateAdmin = (id, data) =>
  api.put(`${EP.ADMIN}/updateAdminById/${id}`, data);

export const deleteAdmin = (id) =>
  api.delete(`${EP.ADMIN}/deleteAdminById/${id}`);

export const updateAdminStatus = (id, status) =>
  api.put(`${EP.ADMIN}/updateAccountStatusById/${id}`, { status });

export const updateAdminImage = (id, file) => {
  const fd = new FormData();
  fd.append("image", file);

  return api.put(`${EP.ADMIN}/updateImageById/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =====================================================
   STUDENT API
===================================================== */

export const registerStudent = (data) =>
  api.post(`${EP.STUDENT}/registerStudent`, data);

export const getAllStudents = (page = 1, limit = 10) =>
  api.get(`${EP.STUDENT}/getAllStudent`, { params: { page, limit } });

export const getStudentById = (id) =>
  api.get(`${EP.STUDENT}/getStudentById/${id}`);

export const updateStudent = (id, data) =>
  api.put(`${EP.STUDENT}/updateStudentById/${id}`, data);

export const deleteStudentById = (id) =>
  api.delete(`${EP.STUDENT}/deleteStudentById/${id}`);

export const updateStudentAccountStatus = (id, status) =>
  api.put(`${EP.STUDENT}/updateAccountStatusById/${id}`, { status });

export const updateStudentImage = (id, file) => {
  const fd = new FormData();
  fd.append("image", file);

  return api.put(`${EP.STUDENT}/updateImageById/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =====================================================
   LECTURER API
===================================================== */

export const registerLecturer = (data) =>
  api.post(`${EP.LECTURER}/registerLecture`, data);

export const getAllLecturers = (page = 1, limit = 10) =>
  api.get(`${EP.LECTURER}/getAllLecture`, { params: { page, limit } });

export const getLecturerById = (id) =>
  api.get(`${EP.LECTURER}/getLectureById/${id}`);

export const updateLecturerById = (id, data) =>
  api.put(`${EP.LECTURER}/updateLectureById/${id}`, data);

export const deleteLecturerById = (id) =>
  api.delete(`${EP.LECTURER}/deleteLectureById/${id}`);

export const updateLecturerAccountStatus = (id, status) =>
  api.put(`${EP.LECTURER}/updateAccountStatusById/${id}`, { status });

export const uploadLecturerCVByUserId = (id, file) => {
  const fd = new FormData();
  fd.append("cv", file);

  return api.put(`${EP.LECTURER}/updateCVById/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;