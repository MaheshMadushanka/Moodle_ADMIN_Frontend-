import React from "react";
import { Moon, Sun, LogOut, Search, Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
const userDetails = JSON.parse(localStorage.getItem("userDetails"));
const admin = userDetails?.admins?.[0];

function Navbar({ onMenuClick }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav
      className={`${
        isDarkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200"
      } border-b transition-colors duration-300`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-slate-800 text-slate-300"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Menu size={20} />
          </button>

          <h1
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {/* Mobile */}
            <span className="md:hidden">VTCA</span>

            {/* Desktop */}
            <span className="hidden md:inline">
              Vocational Training Center Admin
            </span>
          </h1>
        </div>

        {/* Middle Section - Search (Optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div
            className={`relative w-full ${
              isDarkMode ? "bg-slate-800" : "bg-slate-50"
            } rounded-lg`}
          >
            <Search
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-colors ${
                isDarkMode
                  ? "bg-slate-800 text-slate-200 placeholder-slate-500 focus:bg-slate-700"
                  : "bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-slate-100"
              }`}
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-slate-800 text-slate-300"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Divider */}
          <div
            className={`h-8 w-px ${
              isDarkMode ? "bg-slate-700" : "bg-slate-200"
            }`}
          ></div>

          {/* Profile */}
          <button
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
          >
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                  isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {admin?.imageURL ? (
                  <img
                    src={admin.imageURL}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  admin?.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </button>

          {/* Logout Button */}
          {/* <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isDarkMode
                ? "text-slate-300 hover:bg-red-900/20 hover:text-red-400 border border-slate-700 hover:border-red-800"
                : "text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200"
            }`}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
