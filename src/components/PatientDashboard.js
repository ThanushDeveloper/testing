import React from "react";

function PatientDashboard({ auth, setAuth }) {
  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false, role: null, username: "" });
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#e3f2fd" }}>
      <h1>🧍‍♂️ Patient Dashboard</h1>
      <p>
        Hi <strong>{auth.username}</strong>, welcome to your dashboard.
      </p>
      <ul>
        <li>📅 Book Appointments</li>
        <li>📜 View Prescriptions</li>
        <li>📝 Health Records</li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default PatientDashboard;
