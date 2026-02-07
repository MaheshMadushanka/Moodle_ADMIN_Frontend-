import React, { useEffect, useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import CourseCard from '../../components/courses/CourseCard'
import CourseDetails from '../../components/courses/CourseDetails'
import CreateCourseModal from '../../components/courses/CreateCourseModal'

const STORAGE_KEY = 'moodle_courses_v1'

// Sample courses for initial state
const INITIAL_COURSES = [
  {
    id: '1',
    title: 'S2 - Pre Academic Week - 25S1',
    shortDescription: 'Foundation course for academic preparation',
    description: 'This course is designed to prepare students for their academic journey. It covers essential skills and knowledge needed for success in higher education.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    mode: 'Online',
    language: 'English',
    duration: '1 week',
  },
  {
    id: '2',
    title: 'BIT Student Matters (25S1)',
    shortDescription: 'Essential student services and support',
    description: 'Learn about all the resources and support available to students. This course covers academic advising, career services, and student life.',
    thumbnail: 'https://images.unsplash.com/photo-1516534775068-bb6dae729cb4?w=500&h=300&fit=crop',
    mode: 'Physical',
    language: 'English',
    duration: '2 weeks',
  },
  {
    id: '3',
    title: 'BIT Administrative Matters - 2024',
    shortDescription: 'Administrative processes and procedures',
    description: 'Understanding administrative requirements and processes for students. Covers registration, enrollment, and compliance matters.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    mode: 'Online',
    language: 'English',
    duration: '3 days',
  },
  {
    id: '4',
    title: 'Orientation 24In2 (Pre Academic Preparation)',
    shortDescription: 'Campus orientation and preparation',
    description: 'Get oriented with the campus, facilities, and academic expectations. This hybrid course combines online modules with in-person orientation sessions.',
    thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=300&fit=crop',
    mode: 'Hybrid',
    language: 'English',
    duration: '1 week',
  },
]

function Courses() {
  const { isDarkMode } = useTheme()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Load courses from localStorage or use initial courses
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setCourses(JSON.parse(stored))
      } catch (e) {
        setCourses(INITIAL_COURSES)
      }
    } else {
      setCourses(INITIAL_COURSES)
    }
  }, [])

  // Save courses to localStorage
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
    }
  }, [courses])

  const handleCreateCourse = (newCourse) => {
    setCourses(prev => [newCourse, ...prev])
    setShowCreateModal(false)
  }

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
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Plus size={20} />
            Create Course
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