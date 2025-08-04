import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.clear();
    
    // Reset auth state
    setAuth({
      isAuthenticated: false,
      role: null,
      username: "",
    });
    
    // Navigate back to login
    navigate('/');
  };

  return (
    <div className="navbar">
      <input type="text" placeholder="Search..." />
      <div className="profile">
        <img src="https://via.placeholder.com/40" alt="profile" />
        <span>{auth?.username || 'User'}</span>
        <button 
          onClick={handleLogout}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
