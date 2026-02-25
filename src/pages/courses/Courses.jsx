import React, { useEffect, useState } from 'react'
import { Plus, BookOpen, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import CourseCard from '../../components/courses/CourseCard'
import CourseDetails from '../../components/courses/CourseDetails'
import CreateCourseModal from '../../components/courses/CreateCourseModal'
import { getAllCourses, createCourse, updateCourseImageById } from '../../Api/Api'
import Swal from 'sweetalert2'

function Courses() {
  const { isDarkMode } = useTheme()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch courses from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllCourses(1, 100)
        if (res.data && res.data.status) {
          setCourses(res.data.result || [])
        } else {
          setCourses([])
        }
      } catch (err) {
        console.error('Failed to load courses', err)
        setCourses([])
      }
    }
    load()
  }, [])

  const handleCreateCourse = async (title, imageFile) => {
  try {
  
    const res = await createCourse(title);

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Create failed");
    }

    const courseId = res.data.result?.id;


    if (imageFile && courseId) {
      await updateCourseImageById(courseId, imageFile);
    }

 
    Swal.fire({
      icon: "success",
      title: "Course Created",
      text: "Course created successfully",
      confirmButtonColor: "#3b82f6",
    });

  
    const list = await getAllCourses(1, 100);
    setCourses(list.data?.result || []);
    

    setShowCreateModal(false);

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err.response?.data?.message ||
        err.message ||
        "Failed to create course",
    });
  }
};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Courses
            </h1>
            <p className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Manage and view available courses
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create Course</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <div className={`border rounded-xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-start justify-between">
              <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-3 rounded-lg`}>
                <BookOpen className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={28} />
              </div>
              <div className="text-right">
                <h3 className={`text-sm font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Total Courses
                </h3>
                <p className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {courses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Courses Section */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Recently Added Courses
          </h2>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onView={setSelectedCourse}
                />
              ))}
            </div>
          ) : (
            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-slate-50'}`}>
              <BookOpen className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} size={48} />
              <p className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                No courses yet
              </p>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Create your first course to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCourse}
        />
      )}
    </div>
  )
}

export default Courses