import React from "react";

function DoctorDashboard({ auth, setAuth }) {
  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false, role: null, username: "" });
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#e8f5e9" }}>
      <h1>👨‍⚕️ Doctor Dashboard</h1>
      <p>
        Hello Dr. <strong>{auth.username}</strong>!
      </p>
      <ul>
        <li>🩺 View Appointments</li>
        <li>📁 Access Patient Records</li>
        <li>💊 Manage Prescriptions</li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DoctorDashboard;
