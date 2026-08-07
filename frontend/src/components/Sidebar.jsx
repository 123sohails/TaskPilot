import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { signOut } from "../services/supabase";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
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
  ];

  const isActive = (path) => location.pathname === path;

  // Safe parse user info
  let userEmail = "user@example.com";
  let userInitial = "U";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.email) {
        userEmail = user.email;
        userInitial = user.email.charAt(0).toUpperCase();
      }
    }
  } catch (e) {
    // Ignore parse error
  }

  const userName = userEmail.split("@")[0];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <Link to="/" className="sidebar-logo">
            <span>🚀 TaskPilot</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-toggle"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-email">{userEmail}</span>
          </div>
        </div>

        <button onClick={toggleTheme} className="sidebar-action" title="Toggle Theme">
          <span className="nav-icon">{isDark ? "☀️" : "🌙"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button onClick={handleLogout} className="sidebar-action danger" title="Logout">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
