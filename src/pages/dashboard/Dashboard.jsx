import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

function Dashboard() {
  const { isDarkMode } = useTheme();

  // Sample data for charts
  const studentEnrollmentData = [
    { month: 'Jan', students: 320 },
    { month: 'Feb', students: 380 },
    { month: 'Mar', students: 420 },
    { month: 'Apr', students: 390 },
    { month: 'May', students: 450 },
    { month: 'Jun', students: 520 },
  ];

  const courseCompletionData = [
    { course: 'Math', completed: 85, ongoing: 45 },
    { course: 'Science', completed: 92, ongoing: 38 },
    { course: 'English', completed: 78, ongoing: 52 },
    { course: 'History', completed: 88, ongoing: 42 },
    { course: 'Physics', completed: 70, ongoing: 60 },
  ];

  const categoryData = [
    { name: 'Science', value: 30, color: '#1e40af' },
    { name: 'Arts', value: 25, color: '#3b82f6' },
    { name: 'Technology', value: 35, color: '#60a5fa' },
    { name: 'Business', value: 10, color: '#93c5fd' },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Lecturers',
      value: '156',
      change: '+5.2%',
      trend: 'up',
      icon: GraduationCap,
      bgColor: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
      iconColor: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'Active Courses',
      value: '48',
      change: '+8.1%',
      trend: 'up',
      icon: BookOpen,
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'Course Completion',
      value: '87.5%',
      change: '-2.4%',
      trend: 'down',
      icon: Award,
      bgColor: isDarkMode ? 'bg-slate-800' : 'bg-slate-50',
      iconColor: isDarkMode ? 'text-slate-300' : 'text-slate-600',
      changeColor: 'text-red-600'
    },
  ];

  const recentActivities = [
    { title: 'New student enrolled in Mathematics', time: '5 minutes ago', type: 'enrollment' },
    { title: 'Dr. Smith uploaded course materials', time: '23 minutes ago', type: 'upload' },
    { title: 'Physics course completed by 15 students', time: '1 hour ago', type: 'completion' },
    { title: 'New lecturer added to English department', time: '2 hours ago', type: 'lecturer' },
    { title: 'Assignment submitted by 45 students', time: '3 hours ago', type: 'assignment' },
  ];

  // Dark mode color palette
  const darkColors = {
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    chartGrid: '#334155',
    axis: '#94a3b8'
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
            Dashboard Overview
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <div 
                key={index}
                className={`border rounded-xl p-6 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-blue-900/20' 
                    : 'bg-white border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`${stat.iconColor}`} size={24} />
                  </div>
                  <div className={`flex items-center gap-1 ${stat.changeColor} text-sm font-medium`}>
                    <TrendIcon size={16} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {stat.title}
                </h3>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Student Enrollment Trend */}
          <div className={`border rounded-xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Student Enrollment Trend
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Monthly student registration
                </p>
              </div>
              <BarChart3 className={isDarkMode ? "text-blue-400" : "text-blue-600"} size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentEnrollmentData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? darkColors.chartGrid : '#e2e8f0'} 
                />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? darkColors.axis : '#64748b'} 
                />
                <YAxis 
                  stroke={isDarkMode ? darkColors.axis : '#64748b'} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? darkColors.card : '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: isDarkMode ? darkColors.textPrimary : '#fff',
                    borderColor: isDarkMode ? darkColors.border : '#334155'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke={isDarkMode ? '#60a5fa' : '#1e40af'} 
                  strokeWidth={3}
                  dot={{ fill: isDarkMode ? '#60a5fa' : '#1e40af', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Course Completion */}
          <div className={`border rounded-xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Course Progress
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Completed vs Ongoing
                </p>
              </div>
              <BarChart3 className={isDarkMode ? "text-blue-400" : "text-blue-600"} size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseCompletionData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? darkColors.chartGrid : '#e2e8f0'} 
                />
                <XAxis 
                  dataKey="course" 
                  stroke={isDarkMode ? darkColors.axis : '#64748b'} 
                />
                <YAxis 
                  stroke={isDarkMode ? darkColors.axis : '#64748b'} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? darkColors.card : '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: isDarkMode ? darkColors.textPrimary : '#fff',
                    borderColor: isDarkMode ? darkColors.border : '#334155'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="completed" 
                  fill={isDarkMode ? '#3b82f6' : '#1e40af'} 
                  radius={[8, 8, 0, 0]} 
                />
                <Bar 
                  dataKey="ongoing" 
                  fill={isDarkMode ? '#93c5fd' : '#93c5fd'} 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart - Course Categories */}
          <div className={`border rounded-xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            } mb-2`}>
              Course Categories
            </h2>
            <p className={`text-sm mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Distribution by subject
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? darkColors.card : '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: isDarkMode ? darkColors.textPrimary : '#fff',
                    borderColor: isDarkMode ? darkColors.border : '#334155'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {category.name}
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className={`lg:col-span-2 border rounded-xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Recent Activities
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Latest updates from your platform
                </p>
              </div>
              <Clock className={isDarkMode ? "text-blue-400" : "text-blue-600"} size={20} />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors duration-300 border ${
                    isDarkMode 
                      ? 'border-slate-700 hover:bg-slate-700/50' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {activity.title}
                    </p>
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {activity.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'enrollment' 
                      ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700' :
                    activity.type === 'upload' 
                      ? isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700' :
                    activity.type === 'completion' 
                      ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700' :
                    activity.type === 'lecturer' 
                      ? isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700' :
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-700'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;