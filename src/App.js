import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole, userRole, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (userRole) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "DOCTOR":
        return <Navigate to="/doctor/dashboard" replace />;
      case "PATIENT":
        return <Navigate to="/patient/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    username: "",
    user: null, // Complete user profile data
  });

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userSession = localStorage.getItem('userSession');
    
    if (token && userSession) {
      try {
        const user = JSON.parse(userSession);
        setAuth({
          isAuthenticated: true,
          role: user.role,
          username: user.username,
          user: user,
        });
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            auth.isAuthenticated ? (
              // Redirect authenticated users to their dashboard
              <Navigate 
                to={`/${auth.role.toLowerCase()}/dashboard`} 
                replace 
              />
            ) : (
              <Login setAuth={setAuth} />
            )
          } 
        />
        
        {/* Admin Dashboard Route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute 
              requiredRole="ADMIN" 
              userRole={auth.role} 
              isAuthenticated={auth.isAuthenticated}
            >
              <AdminDashboard auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          } 
        />
        
        {/* Doctor Dashboard Route */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute 
              requiredRole="DOCTOR" 
              userRole={auth.role} 
              isAuthenticated={auth.isAuthenticated}
            >
              <DoctorDashboard auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          } 
        />
        
        {/* Patient Dashboard Route */}
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedRoute 
              requiredRole="PATIENT" 
              userRole={auth.role} 
              isAuthenticated={auth.isAuthenticated}
            >
              <PatientDashboard auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
