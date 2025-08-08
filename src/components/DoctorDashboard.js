import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function DoctorDashboard({ auth, setAuth, onLogout }) {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    console.log('DoctorDashboard: handleLogout called');
    try {
      // Use the centralized logout function
      onLogout();
      console.log('DoctorDashboard: onLogout completed');
   
      // Use setTimeout to ensure state updates are processed before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
        console.log('DoctorDashboard: Navigation to login completed');
      }, 100);

    } catch (error) {
      console.error('DoctorDashboard: Error during logout:', error);
      // Even if there's an error, try to navigate away
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }

  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowUserDropdown(false);
  };

  return (
    <div className="dashboard-container" data-theme="light">
      helo
      {/* Header
      <header className="header">
        <div className="header-left">
          <div className="search-container">
            <i className="search-icon fas fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search or type command..."
            />
          </div>
        </div>

        <div className="header-right">
          <button className="notification-btn" title="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">2</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar">
              {auth?.user?.image ? (
                <img 
                  src={auth.user.image} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                auth?.user?.name?.charAt(0)?.toUpperCase() || 'D'
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{auth?.user?.name || auth?.username || 'Doctor'}</div>
              <div className="user-role">{auth?.role || 'Doctor'}</div>
            </div>
            <i
              className="fas fa-chevron-down"
              style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            ></i>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-item" onClick={handleProfileClick}>
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item signout-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
*/}
      {/* Main Content */}
   {/*   <main className="main-content">
        <div style={{ padding: "2rem", backgroundColor: "#e8f5e9", minHeight: "calc(100vh - 80px)" }}>
          <h1>👨‍⚕️ Doctor Dashboard</h1>
          <p>
            Hello Dr. <strong>{auth?.user?.name || auth?.username}</strong>!
          </p>
          <ul>
            <li>🩺 View Appointments</li>
            <li>📁 Access Patient Records</li>
            <li>💊 Manage Prescriptions</li>
          </ul>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Doctor Profile</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowProfileModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {auth?.user?.image ? (
                    <img 
                      src={auth.user.image} 
                      alt="Profile" 
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      {auth?.user?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                  )}
                </div>
                <h3>{auth?.user?.name || auth?.username || 'Doctor'}</h3>
                <p className="user-role-badge">{auth?.role || 'Doctor'}</p>
              </div>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-id-card"></i> ID:
                  </span>
                  <span className="detail-value">{auth?.user?.id || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-user"></i> Full Name:
                  </span>
                  <span className="detail-value">{auth?.user?.name || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-envelope"></i> Email:
                  </span>
                  <span className="detail-value">{auth?.user?.email || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-phone"></i> Phone:
                  </span>
                  <span className="detail-value">{auth?.user?.phone || 'N/A'}</span>
                </div>
                
                {auth?.user?.specialization && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-stethoscope"></i> Specialization:
                    </span>
                    <span className="detail-value">{auth.user.specialization}</span>
                  </div>
                )}
                
                {auth?.user?.experience && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-clock"></i> Experience:
                    </span>
                    <span className="detail-value">{auth.user.experience} years</span>
                  </div>
                )}
                
                {auth?.user?.department && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-building"></i> Department:
                    </span>
                    <span className="detail-value">{auth.user.department}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-shield-alt"></i> Role:
                  </span>
                  <span className="detail-value">{auth?.role || 'Doctor'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-info-circle"></i> Status:
                  </span>
                  <span className="detail-value status-active">{auth?.user?.status || 'ACTIVE'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default DoctorDashboard;
