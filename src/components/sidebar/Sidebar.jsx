import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Briefcase,
  BarChart3, 
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
  import logo from "../../../public/vtc2.png";  

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(getActiveItemFromPath(location.pathname));
  const { isDarkMode, toggleDarkMode } = useTheme();
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  console.log("User details in Sidebar:", userDetails);
  const adminName = userDetails.admins?.[0]?.full_name || "Admin";
  // Helper function to determine active item based on current path
  function getActiveItemFromPath(path) {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/students': 'Students',
      '/lecturers': 'Lecturers',
      '/roles': 'Roles',
      '/courses': 'Courses',
      '/reports': 'Reports & Analytics',
      '/settings': 'Settings'
    };
    
    // Find the matching route or return the first matching segment
    for (const [route, name] of Object.entries(pathMap)) {
      if (path.startsWith(route)) {
        return name;
      }
    }
    
    return 'Dashboard'; // default
  }

  // Update active item when location changes
  React.useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Students', icon: GraduationCap, path: '/students' },
    { name: 'Lecturers', icon: Users, path: '/lecturers' },
    { name: 'Roles', icon: Briefcase, path: '/roles' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName);
    navigate(path);
    // On small screens, auto-hide sidebar after navigation
    try {
      if (window.innerWidth < 768) setMobileVisible(false);
    } catch (e) {
      // ignore in non-browser env
    }
  };

  // Expose sidebar width as a CSS variable so the page can resize accordingly
  useEffect(() => {
    const applyWidth = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const width = isMobile ? '0px' : (isCollapsed ? '5rem' : '16rem');
      try {
        document.documentElement.style.setProperty('--sidebar-width', width);
      } catch (e) {
        // ignore
      }
    };

    applyWidth();
    window.addEventListener('resize', applyWidth);
    return () => window.removeEventListener('resize', applyWidth);
  }, [isCollapsed, mobileVisible]);

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("userDetails");
    navigate('/');
  };

  // Sidebar is always dark blue theme, but changes shade based on dark mode toggle
  const sidebarDarkColor = isDarkMode ? 'bg-slate-900' : 'bg-slate-800';
  const sidebarTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-200';
  const sidebarBorderColor = isDarkMode ? 'border-slate-800' : 'border-slate-700';
  const sidebarHoverBg = isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-700/50';
  const sidebarActiveBg = isDarkMode ? 'bg-slate-800' : 'bg-slate-700';

  return (
    // Use transform to hide on small screens; support collapsed (icons-only) state
    <div className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-200 ${sidebarDarkColor} ${sidebarTextColor} ${isCollapsed ? 'w-20' : 'w-64'} ${mobileVisible ? 'translate-x-0' : ''} md:translate-x-0 ${!mobileVisible && 'md:translate-x-0'}`}>
      <div className={`flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-64'} transition-width duration-200`}> 
     {/* Logo Section */}
  <div className={`flex items-center justify-between h-16 ${sidebarBorderColor} border-b px-3`}> 
  <button
    onClick={() => handleNavigation('/dashboard', 'Dashboard')}
    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
  >
    <div className="w-8 h-8 flex items-center justify-center">
      <img
        src={logo}
        alt="Moodle Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {!isCollapsed && <span className="text-lg font-semibold">Hi 👋🏻 {adminName}</span>}
  </button>
  <div className="flex items-center gap-2">
    {/* Collapse toggle (desktop) */}
    <button
      onClick={() => setIsCollapsed((s) => !s)}
      className={`p-2 rounded-md hover:bg-slate-700/40 ${sidebarTextColor} md:inline-flex hidden`}
      title={isCollapsed ? 'Expand' : 'Collapse'}
    >
      {isCollapsed ? '»' : '«'}
    </button>
    {/* Mobile open/close */}
    <button
      onClick={() => setMobileVisible((v) => !v)}
      className={`p-2 rounded-md hover:bg-slate-700/40 ${sidebarTextColor} md:hidden inline-flex`}
      aria-label="Toggle sidebar"
    >
      {mobileVisible ? '✕' : '☰'}
    </button>
  </div>
</div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          
          return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path, item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? `${sidebarActiveBg} text-white`
                    : `${sidebarTextColor} ${sidebarHoverBg} hover:text-slate-100`
                }`}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`p-3 space-y-2 ${sidebarBorderColor} border-t`}> 
        {/* Light/Dark Mode Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-slate-700/50'
        }`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon size={20} className="text-slate-300" />
              ) : (
                <Sun size={20} className="text-amber-300" />
              )}
              <span className="text-sm font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-blue-600' : 'bg-amber-500'
            }`}
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {isDarkMode ? (
                <Moon size={12} className="text-blue-600" />
              ) : (
                <Sun size={12} className="text-amber-500" />
              )}
            </span>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => { handleLogout(); setMobileVisible(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${sidebarTextColor} ${sidebarHoverBg} hover:text-slate-100`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
      </div>
    </div>
  );
}

export default Sidebar;