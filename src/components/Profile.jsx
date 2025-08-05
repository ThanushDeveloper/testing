import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Profile.css';

const Profile = () => {
  const { auth, userProfile, profileLoading, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get from context
        if (userProfile) {
          setProfile(userProfile);
          if (userProfile.adminPhoto) {
            const imageUrl = authService.convertToImageUrl(userProfile.adminPhoto);
            setProfileImage(imageUrl);
          }
        } else {
          // If not in context, fetch directly
          const profileData = await authService.getCurrentAdminProfile();
          if (profileData) {
            setProfile(profileData);
            if (profileData.adminPhoto) {
              const imageUrl = authService.convertToImageUrl(profileData.adminPhoto);
              setProfileImage(imageUrl);
            }
          } else {
            setError('Profile data not found');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated && auth.role === 'ADMIN') {
      fetchProfile();
    }
  }, [auth, userProfile]);

  const handleRefresh = async () => {
    try {
      await refreshProfile();
      // The useEffect will handle updating the local state
    } catch (err) {
      setError('Failed to refresh profile data');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'status-badge active';
      case 'INACTIVE':
        return 'status-badge inactive';
      case 'SUSPENDED':
        return 'status-badge suspended';
      default:
        return 'status-badge';
    }
  };

  const getAdminTypeBadgeClass = (adminType) => {
    switch (adminType?.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'admin-type-badge super-admin';
      case 'STAFF_ADMIN':
        return 'admin-type-badge staff-admin';
      case 'SUPPORT_ADMIN':
        return 'admin-type-badge support-admin';
      default:
        return 'admin-type-badge';
    }
  };

  if (!auth.isAuthenticated || auth.role !== 'ADMIN') {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>You must be logged in as an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="profile-container">
          <div className="profile-header">
            <h1>
              <i className="fas fa-user-circle"></i>
              My Profile
            </h1>
            <button 
              className="refresh-btn" 
              onClick={handleRefresh}
              disabled={loading || profileLoading}
            >
              <i className={`fas fa-sync-alt ${(loading || profileLoading) ? 'spinning' : ''}`}></i>
              Refresh
            </button>
          </div>

          {(loading || profileLoading) && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading profile data...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={handleRefresh} className="retry-btn">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {profile && !loading && !profileLoading && (
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-photo-section">
                  <div className="photo-container">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Admin Profile" 
                        className="profile-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="no-photo">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div className="no-photo" style={{ display: profileImage ? 'none' : 'flex' }}>
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <h2 className="profile-name">{profile.name || 'N/A'}</h2>
                  <div className="profile-badges">
                    <span className={getStatusBadgeClass(profile.status)}>
                      {profile.status || 'Unknown'}
                    </span>
                    <span className={getAdminTypeBadgeClass(profile.adminType)}>
                      {profile.adminType?.replace('_', ' ') || 'Unknown Type'}
                    </span>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-id-badge"></i>
                        Admin ID
                      </label>
                      <span>{profile.id || 'N/A'}</span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-user"></i>
                        Full Name
                      </label>
                      <span>{profile.name || 'N/A'}</span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email Address
                      </label>
                      <span>{profile.email || 'N/A'}</span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-phone"></i>
                        Phone Number
                      </label>
                      <span>{profile.phone || 'N/A'}</span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-toggle-on"></i>
                        Account Status
                      </label>
                      <span className={getStatusBadgeClass(profile.status)}>
                        {profile.status || 'Unknown'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-user-shield"></i>
                        Admin Type
                      </label>
                      <span className={getAdminTypeBadgeClass(profile.adminType)}>
                        {profile.adminType?.replace('_', ' ') || 'Unknown Type'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-plus"></i>
                        Account Created
                      </label>
                      <span>{formatDate(profile.createdAt)}</span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-check"></i>
                        Last Updated
                      </label>
                      <span>{formatDate(profile.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="action-btn primary">
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-camera"></i>
                  Update Photo
                </button>
              </div>
            </div>
          )}

          {!profile && !loading && !profileLoading && !error && (
            <div className="no-profile">
              <div className="no-profile-message">
                <i className="fas fa-user-slash"></i>
                <h3>No Profile Data</h3>
                <p>Unable to load profile information. Please try refreshing the page.</p>
                <button onClick={handleRefresh} className="retry-btn">
                  <i className="fas fa-refresh"></i>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;