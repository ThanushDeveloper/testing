import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import "../styles/Navbar.css";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);

  // Handle profile image
  useEffect(() => {
    if (userProfile && userProfile.adminPhoto) {
      const imageUrl = authService.convertToImageUrl(userProfile.adminPhoto);
      setProfileImage(imageUrl);
    }
  }, [userProfile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/admin/profile');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getDisplayName = () => {
    if (userProfile && userProfile.name) {
      return userProfile.name;
    }
    return auth?.username || 'User';
  };

  const getDisplayEmail = () => {
    if (userProfile && userProfile.email) {
      return userProfile.email;
    }
    return auth?.email || auth?.username || '';
  };

  return (
    <div className="navbar">
      <div className="navbar-search">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Search..." />
      </div>
      
      <div className="navbar-profile" ref={dropdownRef}>
        <div className="profile-info" onClick={toggleDropdown}>
          <div className="profile-avatar">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="default-avatar">
                <i className="fas fa-user"></i>
              </div>
            )}
            <div className="default-avatar" style={{ display: profileImage ? 'none' : 'flex' }}>
              <i className="fas fa-user"></i>
            </div>
          </div>
          
          <div className="profile-text">
            <span className="profile-name">{getDisplayName()}</span>
            <span className="profile-role">{auth?.role || 'User'}</span>
          </div>
          
          <i className={`fas fa-chevron-down dropdown-arrow ${showDropdown ? 'rotated' : ''}`}></i>
        </div>

        {showDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <div className="default-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <div className="dropdown-info">
                <div className="dropdown-name">{getDisplayName()}</div>
                <div className="dropdown-email">{getDisplayEmail()}</div>
                {userProfile && (
                  <div className="dropdown-status">
                    <span className={`status-indicator ${userProfile.status?.toLowerCase()}`}>
                      {userProfile.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleProfileClick}>
                <i className="fas fa-user-circle"></i>
                <span>My Profile</span>
              </button>
              
              <button className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button>
              
              <button className="dropdown-item">
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </button>
              
              <button className="dropdown-item">
                <i className="fas fa-question-circle"></i>
                <span>Help & Support</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
