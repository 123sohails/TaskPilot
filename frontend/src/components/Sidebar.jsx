import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../services/supabase";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/workflows/create", label: "Create Workflow", icon: "➕" },
    { path: "/tasks", label: "Executions", icon: "⚡" },
    { path: "/integrations", label: "Integrations", icon: "🔗" },
    { path: "/templates", label: "Templates", icon: "📋" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-900 dark:bg-black text-white transition-all duration-300 z-50 ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-800">
          {!isCollapsed && (
            <Link to="/" className="text-xl font-bold text-blue-400">
              TaskPilot
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 dark:hover:bg-gray-900 text-gray-300"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 dark:border-gray-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors text-gray-300"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {!isCollapsed && <span className="ml-3 font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-600 transition-colors text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
