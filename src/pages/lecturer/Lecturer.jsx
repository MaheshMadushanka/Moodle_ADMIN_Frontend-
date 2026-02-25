import React, { useEffect, useState } from "react";
import { useTheme } from '../../context/ThemeContext';
import { Users, Eye, Edit, Trash2, Plus, X, Search } from "lucide-react";
import {
  getAllLecturers,
  getAllUsers,
  getAllRoles,
  registerLecturer,
  deleteLecturerById,
  getAllCourses,
  getCourseById,
  getByLecturerId,
  uploadLecturerCVByUserId,
  updateLecturerAccountStatus,
  assignCoursesToLecturer,
  updateLecturerById,
} from "../../Api/Api";
import Swal from "sweetalert2";

const STORAGE_KEY = "moodle_lecturers_v1";

function Lecturer() {
  const { isDarkMode } = useTheme();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    full_Name: "",
    email: "",
    phone: "",
    mode: "Online",
    address: "",
    regNumber: "",
    nic: "",
    roleId: 1,
  });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    full_Name: "",
    email: "",
    phone: "",
    mode: "online",
    address: "",
    regNumber: "",
    nic: "",
  });
  const [assignedCourses, setAssignedCourses] = useState([]);

  // Fetch lecturers and roles on component mount
  useEffect(() => {
    fetchLecturers();
    fetchRoles();
  }, []);

  // Save to localStorage whenever lecturers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lecturers));
  }, [lecturers]);

  const fetchLecturers = async () => {
    setLoading(true);
    try {
      const response = await getAllLecturers();
      if (response.data.status && response.data.result) {
        const list = response.data.result || [];

        // fetch users to map emails by user_id
        try {
          const usersRes = await getAllUsers(1, 10000);
          const usersList = (usersRes?.data?.result) || (usersRes?.data) || usersRes || [];
          const usersMap = new Map();
          usersList.forEach((u) => usersMap.set(u.id, u));

          const merged = list.map((lect) => {
            const user = usersMap.get(lect.user_id) || usersMap.get(lect.userId) || null;
            return {
              ...lect,
              user_email: user?.email || lect.email || "",
            };
          });

          setLecturers(merged);
        } catch (uErr) {
          // fallback: set original list if users fetch fails
          console.error('Failed to fetch users for email mapping', uErr);
          setLecturers(list);
        }
      }
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      // Load from localStorage if API fails
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setLecturers(JSON.parse(saved));
        } catch (e) {
          setLecturers([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      if (response.data.status && response.data.result) {
        setRoles(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const fullName = (form.fullName || form.full_Name || "").toString().trim();
    const email = (form.email || "").toString().trim();
    const phone = (form.contact || form.phone || "").toString().trim();
    const regNumber = (form.regNumber || form.reg_number || "").toString().trim();
    const address = (form.address || "").toString().trim();

    if (!fullName) return "Full Name is required.";
    if (!email) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email.";
    if (!phone) return "Phone Number is required.";
    if (!/^\d{7,15}$/.test(phone)) return "Contact should be 7-15 digits (WhatsApp number).";
    if (!regNumber) return "Registration Number is required.";
    if (!address) return "Address is required.";

    if (cvFile) {
      const lower = cvFile.name.toLowerCase();
      if (!(lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx"))) {
        return "CV must be a PDF, DOC or DOCX file.";
      }
    }
    return null;
  }
    async function uploadCV(id) {
      if (!cvFile) return
      if (!id) {
        console.warn('uploadCV: missing user id')
        return
      }
      try {
        const response = await uploadLecturerCVByUserId(id, cvFile)
        console.log('Response from uploadLecturerCVByUserId: ', response.data)
        if (response.data && response.data.status) {
          console.log('CV uploaded successfully')
          }
         else {
         console.warn('CV upload failed', response.data)
          }
        }
       catch (err) {
        console.error('uploadLecturerCVByUserId error', err)
      }
    }

    async function assignCourses(id) {
      if (selectedCourseIds.length === 0) return
      if (!id) {
        console.warn('assignCourses: missing lecturer id')
        return
      }
      try {
        const response = await assignCoursesToLecturer(id, selectedCourseIds)
        console.log('Response from assignCoursesToLecturer: ', response.data)
        if (response.data && response.data.status) {
          console.log('Courses assigned successfully')
        } else {
          console.warn('Course assignment failed', response.data)
        }
      } catch (err) {
        console.error('assignCoursesToLecturer error', err)
       
      }
      
    }
  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: err,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setLoading(true);
    try {
      // Transform form data to snake_case to match API expectations (use fallbacks for mixed keys)
      // Normalize dob: convert to YYYY-MM-DD if valid, otherwise send null
      const rawDob = form.dob || form.DOB || form.dob || "";
      let normalizedDob = null;
      if (rawDob) {
        const d = new Date(rawDob);
        if (!isNaN(d.getTime())) {
          normalizedDob = d.toISOString().split("T")[0];
        } else {
          // try to parse common formats (fallback) - keep null if invalid
          normalizedDob = null;
        }
      }

      const payload = {
        full_name: form.fullName || form.full_Name || "",
        email: form.email || "",
        phone: form.contact || form.phone || "",
        address: form.address || "",
        mode: form.mode || "online",
        dob: normalizedDob,
        reg_number: form.regNumber || form.reg_number || "",
        nic: form.nic || "",
        role_id: form.roleId || form.role_id || null,
      };
      
      console.log("Sending lecturer payload:", payload);
      const response = await registerLecturer(payload);
      if (response.data.status) {
        // Extract lecturer ID - handle different response structures
        let lecturerId = response.data.result?.id || response.data.result?.[0]?.id || response.data.id;
        console.log("Lecturer registration response:", response.data);
        console.log("Extracted lecturerId:", lecturerId);
        
        if (!lecturerId) {
          console.warn("No lecturer ID found in response. Response data:", response.data);
        }
        
        // upload CV using lecturer id
        if (lecturerId) await uploadCV(lecturerId);
        // assign courses using lecturer id
        if (lecturerId) await assignCourses(lecturerId);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Lecturer added successfully",
          confirmButtonColor: "#3b82f6",
        });
        // Reset both variants so form inputs bound to either name are cleared
        setForm({
          full_Name: "",
          email: "",
          phone: "",
          mode: "online",
          dob: "",
          address: "",
          reg_number: "",
          nic: "",
          role_id: 1,
        });
        setShowAdd(false);
        fetchLecturers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to add lecturer",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add lecturer";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const l = lecturers.find((x) => x.id === id);
    if (!l) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Lecturer",
      text: `Are you sure you want to delete "${l.full_name || l.fullName}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const response = await deleteLecturerById(id);
      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Lecturer deleted successfully",
          confirmButtonColor: "#3b82f6",
        });
        setLecturers((prev) => prev.filter((x) => x.id !== id));
        if (selected && selected.id === id) setSelected(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete lecturer",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete lecturer";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  }

  // Fetch courses for assignment
  const fetchCoursesList = async () => {
    try {
      const res = await getAllCourses(1, 100);
      if (res.data && res.data.status) {
        setCourses(res.data.result || []);
      }
    } catch (err) {
      console.error("Error fetching courses", err);
      setCourses([]);
    }
  };

  // Initialize edit form when selected changes
  useEffect(() => {
    if (selected && selected.id) {
      setEditForm({
        fullName: selected.full_name || selected.fullName || "",
        email: selected.email || "",
        contact: selected.phone || selected.contact || "",
        mode: selected.mode || "Online",
        dob: selected.dob || "",
        address: selected.address || "",
        regNumber: selected.reg_number || selected.regNumber || "",
        nic: selected.nic || "",
      });
      
      // Fetch assigned courses for this lecturer
      fetchAssignedCourses(selected.id);
      setEditMode(false);
    } else if (selected) {
      console.warn("Selected lecturer has no id:", selected);
      setAssignedCourses([]);
    }
  }, [selected]);

  // Fetch assigned courses for a lecturer with course details
  const fetchAssignedCourses = async (lecturerId) => {
    if (!lecturerId) {
      console.warn("fetchAssignedCourses: lecturerId is undefined");
      setAssignedCourses([]);
      return;
    }
    try {
      const res = await getByLecturerId(lecturerId);
      const courseAssociations = res.data.result || res.data || [];
      
      // If empty, set empty and return
      if (!courseAssociations || courseAssociations.length === 0) {
        setAssignedCourses([]);
        return;
      }
      
      // Fetch full course details for each association
      const enrichedCourses = await Promise.all(
        courseAssociations.map(async (association) => {
          try {
            // Extract course_id from association
            const courseId = association.course_id || association.courseId;
            if (!courseId) return null;
            
            const courseRes = await getCourseById(courseId);
            const courseData = courseRes.data.result || courseRes.data;
            return courseData;
          } catch (err) {
            console.error(`Failed to fetch course ${association.course_id || association.courseId}:`, err);
            return null;
          }
        })
      );
      
      // Filter out null values and set state
      setAssignedCourses(enrichedCourses.filter(c => c !== null));
    } catch (err) {
      console.error("Error fetching assigned courses:", err);
      setAssignedCourses([]);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selected || !selected.id) return;
    setActionLoading(true);
    try {
      const response = await updateLecturerById(selected.id, editForm);
      if (response.data && response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: response.data.message || "Lecturer updated successfully",
          confirmButtonColor: "#3b82f6",
        });
        // update local state
        setLecturers((prev) =>
          prev.map((l) =>
            l.id === selected.id
              ? {
                  ...l,
                  full_name: editForm.full_Name,
                  email: editForm.email,
                  phone: editForm.phone,
                  mode: editForm.mode,
                  address: editForm.address,
                  reg_number: editForm.regNumber,
                  nic: editForm.nic,
                }
              : l,
          ),
        );
        setSelected((prev) => ({
          ...prev,
          full_name: editForm.full_Name,
          email: editForm.email,
          phone: editForm.phone,
          mode: editForm.mode,
          address: editForm.address,
          reg_number: editForm.regNumber,
          nic: editForm.nic,
        }));
        setEditMode(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "Failed to update",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update lecturer",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const lowered = query.trim().toLowerCase();
  const filtered = lecturers.filter((l) => {
    if (!lowered) return true;
    const fullName = l.full_name || l.fullName || "";
    const email = l.email || l.user_email || "";
    const contact = l.phone || l.contact || "";
    const subject = l.subject || "";
    return (
      fullName.toLowerCase().includes(lowered) ||
      email.toLowerCase().includes(lowered) ||
      contact.toLowerCase().includes(lowered) ||
      subject.toLowerCase().includes(lowered)
    );
  });

  const total = lecturers.length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? "text-white" : "text-slate-900"} mb-2`}
          >
            Lecturer Management
          </h1>
          <p
            className={`transition-colors duration-300 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            Manage and monitor all lecturer registrations
          </p>
        </div>

        <div className="mb-8">
          <div
            className={`border rounded-xl p-6 transition-all duration-300 ${isDarkMode ? "bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-blue-900/20" : "bg-white border-slate-200 hover:shadow-lg"}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"} p-3 rounded-lg`}
              >
                <Users
                  className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                  size={24}
                />
              </div>
              <div className="text-right">
                <h3
                  className={`text-sm font-medium mb-1 transition-colors duration-300 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                >
                  Total Lecturers
                </h3>
                <p
                  className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search lecturers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors duration-300 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 min-h-[44px] ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} shadow-lg hover:shadow-xl whitespace-nowrap`}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Lecturer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div
          className={`border rounded-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full">
              <thead className={isDarkMode ? "bg-slate-700" : "bg-slate-50"}>
                <tr>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Reg. #
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Full Name
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Contact
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Mode
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    

                  </th>
                  <th
                    className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((l) => (
                    <tr
                      key={l.id}
                      className={`transition-colors duration-150 ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                    >
                      <td
                        className={`px-4 py-3 text-xs font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        {l.reg_number || l.regNumber}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {l.full_name || l.fullName}
                      </td>
                      <td
                        className={`px-4 py-3 text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {l.email || l.user_email}
                      </td>
                      <td
                        className={`px-4 py-3 text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {l.phone || l.contact}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${(l.mode || l.mode) === "online" ? (isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700") : isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-700"}`}
                        >
                          {l.mode || "Online"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {l.subject}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelected(l)}
                            disabled={loading}
                            className={`p-1.5 rounded transition-colors duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50 ${isDarkMode ? "hover:bg-blue-900/30 text-blue-400" : "hover:bg-blue-50 text-blue-600"}`}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(l.id)}
                            disabled={loading}
                            className={`p-1.5 rounded transition-colors duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50 ${isDarkMode ? "hover:bg-red-900/30 text-red-400" : "hover:bg-red-50 text-red-600"}`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className={`px-4 py-12 text-center text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {loading ? "Loading..." : "No lecturers found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden p-4 space-y-4">
            {filtered.length > 0 ? (
              filtered.map((l) => (
                <div
                  key={l.id}
                  className={`p-4 border rounded-lg ${isDarkMode ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p
                        className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {l.full_name || l.fullName}
                      </p>
                      <p
                        className={`text-xs ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        {l.reg_number || l.regNumber}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${(l.mode || "").toLowerCase() === "online" ? (isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700") : isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-700"}`}
                    >
                      {l.mode || "#"}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs mb-4">
                    <p>
                      <strong>Email:</strong>{" "}
                      <span
                        className={
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }
                      >
                        {l.email}
                      </span>
                    </p>
                    <p>
                      <strong>Contact:</strong>{" "}
                      <span
                        className={
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }
                      >
                        {l.phone || l.contact}
                      </span>
                    </p>
                    <p>
                      <strong>Subject:</strong>{" "}
                      <span
                        className={
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }
                      >
                        {l.subject}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(l)}
                      disabled={loading}
                      className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      disabled={loading}
                      className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`text-center py-8 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                {loading ? "Loading..." : "No lecturers found"}
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-4 flex justify-between items-center text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          <p>
            Showing {filtered.length} of {total} lecturers
          </p>
        </div>
        {/* Lecturer Details Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4 sm:p-0">
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6`}
            >
              <div className="flex items-start justify-between mb-6">
                <h2
                  className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  Add Lecturer
                </h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className={`p-1.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100"}`}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Full Name
                  </label>
                  <input
                    name="full_Name"
                    value={form.full_Name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Contact Number (WhatsApp)
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    placeholder="Digits only"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      Mode
                    </label>
                    <select
                      name="mode"
                      value={form.mode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value={"online"}>online</option>
                      <option value={"physical"}>physical</option>
                    </select>
                  </div>
                  <div>
                   <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Role
                  </label>
                  <select
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.position}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>
                {/* <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Date of Birth
                  </label>
                  <input
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    type="date"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div> */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Registration Number
                  </label>
                  <input
                    name="regNumber"
                    value={form.regNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    NIC (National ID)
                  </label>
                  <input
                    name="nic"
                    value={form.nic}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* CV Upload Section */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Upload CV{" "}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      value={form.cvFile}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                </div>
                {/* Course Assignment Section */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Assign Courses{" "}
                  </label>

                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={fetchCoursesList}
                      className={`px-3 py-2 rounded-md text-sm ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      Load Courses
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded p-2 bg-transparent">
                    {courses.length === 0 ? (
                      <p
                        className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        No courses loaded.
                      </p>
                    ) : (
                      courses.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 mb-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourseIds.includes(c.id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setSelectedCourseIds((prev) => [...prev, c.id]);
                              else
                                setSelectedCourseIds((prev) =>
                                  prev.filter((x) => x !== c.id),
                                );
                            }}
                          />
                          <span
                            className={`${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                          >
                            {c.name} (#{c.id})
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setCourses([]);
                      setSelectedCourseIds([]);
                    }}
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] disabled:opacity-50 ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300"}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors min-h-[44px] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4 sm:p-0">
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6`}
            >
              <div className="flex items-start justify-between mb-6">
                <h2
                  className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  Lecturer Details
                </h2>
                <div className="flex gap-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className={`p-1.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? "hover:bg-blue-900/30 text-blue-400" : "hover:bg-blue-50 text-blue-600"}`}
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className={`p-1.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100"}`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              {editMode ? (
                // Edit Mode
                <form className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Full Name</label>
                    <input
                      type="text"
                      name="full_Name"
                      value={editForm.full_Name}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Contact</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Mode</label>
                      <select
                        name="mode"
                        value={editForm.mode}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option>online</option>
                        <option>physical</option>
                      </select>
                    </div>
                    {/* <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={editForm.dob}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                    </div> */}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Address</label>
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Registration Number</label>
                      <input
                        type="text"
                        name="regNumber"
                        value={editForm.regNumber}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>NIC</label>
                      <input
                        type="text"
                        name="nic"
                        value={editForm.nic}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      disabled={actionLoading}
                      className={`px-6 py-2.5 rounded-lg font-medium min-h-[44px] transition-colors ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={actionLoading}
                      className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors min-h-[44px]"
                    >
                      {actionLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode - Read-only display
                <>
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg mb-4 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}
                  >
                    <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Name
                      </p>
                      <p
                        className={`text-sm font-semibold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {selected.full_name || selected.full_Name}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Reg. Number
                      </p>
                      <p
                        className={`text-sm font-semibold mt-1 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        {selected.reg_number || selected.regNumber}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Email
                      </p>
                      <p
                        className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"} break-all`}
                      >
                          {selected.email || selected.user_email}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Contact
                      </p>
                      <p
                        className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {selected.phone || selected.contact}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Mode
                      </p>
                      <p
                        className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {selected.mode || "Online"}
                      </p>
                    </div>
                    {/* <div>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Date of Birth
                      </p>
                      <p
                        className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {selected.dob || "—"}
                      </p>
                    </div> */}
                    <div className="sm:col-span-2">
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Address
                      </p>
                      <p
                        className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {selected.address || "—"}
                      </p>
                    </div>
                  </div>

                  {/* CV Display Section */}
                  <div className={`mt-4 p-4 rounded-lg border-t ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}>
                    <h3
                      className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      CV
                    </h3>
                    {selected.cvURL ? (
                      <a
                        href={selected.cvURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                      >
                        Download CV
                      </a>
                    ) : (
                      <p
                        className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        No CV uploaded
                      </p>
                    )}
                  </div>

                  {/* Assigned Courses Display Section */}
                  <div className={`mt-4 p-4 rounded-lg border-t ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}>
                    <h3
                      className={`text-sm font-medium mb-3 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      Assigned Courses
                    </h3>
                    {assignedCourses && assignedCourses.length > 0 ? (
                      <div className="space-y-2">
                        {assignedCourses.map((course) => (
                          <div
                            key={course.id}
                            className={`p-2 rounded text-sm ${isDarkMode ? "bg-slate-600/50 text-slate-200" : "bg-slate-100 text-slate-700"}`}
                          >
                            {course.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        No courses assigned
                      </p>
                    )}
                  </div>

                  {/* Account Status Display */}
                  <div className={`mt-4 p-4 rounded-lg border-t ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}>
                    <h3
                      className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      Account Status
                    </h3>
                    <p
                      className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {(
                        selected.account_status ||
                        selected.accountStatus ||
                        "inactive"
                      ).toString()}
                    </p>
                  </div>
                </>
              )}

              {/* Interactive Sections - Only show in Edit Mode */}
              {editMode && (
                <>
              <div className="mt-4 p-4 rounded-lg border-t">
                <h3
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Account
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <p
                    className={`${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    Status:{" "}
                    <strong
                      className={`${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {(
                        selected.account_status ||
                        selected.accountStatus ||
                        "inactive"
                      ).toString()}
                    </strong>
                  </p>
                  <button
                    onClick={async () => {
                      const id = selected.id;
                      if (!id) return;
                      const current = (
                        selected.account_status ||
                        selected.accountStatus ||
                        "inactive"
                      )
                        .toString()
                        .toLowerCase();
                      const next = current === "active" ? "inactive" : "active";
                      const result = await Swal.fire({
                        icon: "question",
                        title: "Change Account Status",
                        text: `Change account status to "${next}"?`,
                        showCancelButton: true,
                        confirmButtonColor: "#3b82f6",
                        cancelButtonColor: "#6b7280",
                        confirmButtonText: "Yes, change",
                      });
                      if (!result.isConfirmed) return;
                      setActionLoading(true);
                      try {
                        const resp = await updateLecturerAccountStatus(
                          id,
                          next,
                        );
                        if (resp.data && resp.data.status) {
                          Swal.fire({
                            icon: "success",
                            title: "Updated",
                            text: resp.data.message || "Account status updated",
                            confirmButtonColor: "#3b82f6",
                          });
                          // update local state
                          setLecturers((prev) =>
                            prev.map((l) =>
                              l.id === id ? { ...l, account_status: next } : l,
                            ),
                          );
                          setSelected((prev) => ({
                            ...prev,
                            account_status: next,
                          }));
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: resp.data?.message || "Failed to update",
                            confirmButtonColor: "#ef4444",
                          });
                        }
                      } catch (err) {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text:
                            err.response?.data?.message ||
                            err.message ||
                            "Failed to update",
                          confirmButtonColor: "#ef4444",
                        });
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {actionLoading ? "Saving..." : "Change Status"}
                  </button>
                </div>

                <h3
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Upload CV
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <button
                    onClick={async () => {
                      const userId = selected.user_id || selected.userId;
                      if (!userId)
                        return Swal.fire({
                          icon: "warning",
                          title: "Missing user id",
                          text: "Cannot upload CV: missing user id",
                          confirmButtonColor: "#f59e0b",
                        });
                      if (!cvFile)
                        return Swal.fire({
                          icon: "warning",
                          title: "No file",
                          text: "Please choose a CV file first",
                          confirmButtonColor: "#f59e0b",
                        });
                      setActionLoading(true);
                      try {
                        const res = await uploadLecturerCVByUserId(
                          userId,
                          cvFile,
                        );
                        if (res.data && res.data.status) {
                          Swal.fire({
                            icon: "success",
                            title: "Uploaded",
                            text:
                              res.data.message || "CV uploaded successfully",
                            confirmButtonColor: "#3b82f6",
                          });
                          setCvFile(null);
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res.data?.message || "Upload failed",
                            confirmButtonColor: "#ef4444",
                          });
                        }
                      } catch (err) {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text:
                            err.response?.data?.message ||
                            err.message ||
                            "Upload failed",
                          confirmButtonColor: "#ef4444",
                        });
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    disabled={actionLoading}
                    className={`px-4 py-2 ml-[-83px] rounded-lg font-medium ${isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Course Assignment */}
              <div className="mt-4 p-4 rounded-lg border-t">
                <h3
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Assign Courses
                </h3>
                <div className="mb-3">
                  <button
                    onClick={fetchCoursesList}
                    className={`px-3 py-2 rounded-md text-sm ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    Load Courses
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-transparent">
                  {courses.length === 0 ? (
                    <p
                      className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      No courses loaded.
                    </p>
                  ) : (
                    courses.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 mb-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedCourseIds((prev) => [...prev, c.id]);
                            else
                              setSelectedCourseIds((prev) =>
                                prev.filter((x) => x !== c.id),
                              );
                          }}
                        />
                        <span
                          className={`${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                        >
                          {c.name} (#{c.id})
                        </span>
                      </label>
                    ))
                  )}
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={async () => {
                      if (!selected) return;
                      if (selectedCourseIds.length === 0)
                        return Swal.fire({
                          icon: "warning",
                          title: "No courses",
                          text: "Select at least one course",
                          confirmButtonColor: "#f59e0b",
                        });
                      setActionLoading(true);
                      try {
                        const res = await assignCoursesToLecturer(
                          selected.id,
                          selectedCourseIds,
                        );
                        if (res.data && res.data.status) {
                          Swal.fire({
                            icon: "success",
                            title: "Assigned",
                            text: res.data.message || "Courses assigned",
                            confirmButtonColor: "#3b82f6",
                          });
                          setSelectedCourseIds([]);
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res.data?.message || "Failed to assign",
                            confirmButtonColor: "#ef4444",
                          });
                        }
                      } catch (err) {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text:
                            err.response?.data?.message ||
                            err.message ||
                            "Failed to assign",
                          confirmButtonColor: "#ef4444",
                        });
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {actionLoading ? "Assigning..." : "Assign Selected"}
                  </button>
                </div>
              </div>
                </>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-h-[44px] min-w-[120px]"
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

export default Lecturer;
