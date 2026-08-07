import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChange } from "./services/supabase";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import Tasks from "./pages/Tasks";
import WorkflowCreate from "./pages/WorkflowCreate";
import ExecutionLogs from "./pages/ExecutionLogs";
import Integrations from "./pages/Integrations";
import Templates from "./pages/Templates";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        localStorage.setItem("token", session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    // Check for existing session
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : "" });
    }
    setLoading(false);

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="auth-container">Loading...</div>;
  }

  // Helper for authenticated routes wrapped in Layout
  const ProtectedRoute = ({ element }) => {
    return user ? <Layout>{element}</Layout> : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/workflows"
            element={<ProtectedRoute element={<Workflows />} />}
          />
          <Route
            path="/workflows/create"
            element={<ProtectedRoute element={<WorkflowCreate />} />}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute element={<Tasks />} />}
          />
          <Route
            path="/executions/:id"
            element={<ProtectedRoute element={<ExecutionLogs />} />}
          />
          <Route
            path="/integrations"
            element={<ProtectedRoute element={<Integrations />} />}
          />
          <Route
            path="/templates"
            element={<ProtectedRoute element={<Templates />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
