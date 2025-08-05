
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/PatientList.css';
import '../styles/PatientList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    adminType: ''
  });

    // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Fetch all admins
  const fetchAllAdmins = useCallback(async () => {

    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8080/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all admins:', error);
      throw error;
    }
  }, []);

  // Load admins data
  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error) {
      setError('Failed to load admins. Please try again.');
      console.error('Error loading admins:', error);
      setAdmins([]);
      setFilteredAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllAdmins]);
  // Apply client-side filtering
  const applyFilters = useCallback(() => {
    let filtered = [...admins];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower) ||
        admin.phone.includes(filters.searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(admin => admin.status === filters.status);
    }

    // Apply admin type filter
    if (filters.adminType) {
      filtered = filtered.filter(admin => admin.adminType === filters.adminType);
    }

    setFilteredAdmins(filtered);
  }, [admins, filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8080/admin/delete/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the list
      loadAdmins();
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
    }
  };

  // Update admin status
  const handleStatusUpdate = async (adminId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the admin's status to ${newStatus}?`)) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.put(
        `http://localhost:8080/admin/update-status/${adminId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { newStatus }
        }
      );

      // Refresh the list
      loadAdmins();
      alert('Admin status updated successfully!');
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format status
  const getStatusBadge = (status) => {
    const statusClass = 
      status === 'ACTIVE' ? 'status-active' : 
      status === 'INACTIVE' ? 'status-inactive' : 'status-suspended';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };
  // Format admin type
  const getAdminTypeBadge = (adminType) => {
    if (!adminType) {
      return <span className="admin-type-badge admin-type-unknown">Unknown</span>;
    }
    const typeClass = 
      adminType === 'SUPER_ADMIN' ? 'admin-type-super' :
      adminType === 'STAFF_ADMIN' ? 'admin-type-staff' : 'admin-type-support';
    return <span className={`admin-type-badge ${typeClass}`}>{adminType.replace('_', ' ')}</span>;
  };

  // Get admin permissions display
  const getPermissionsDisplay = (adminType) => {
    switch(adminType) {
      case 'SUPER_ADMIN':
        return 'Full System Access';
      case 'STAFF_ADMIN':
        return 'Staff Management';
      case 'SUPPORT_ADMIN':
        return 'User Support';
      default:
        return 'Limited Access';
    }
  };

  // Get admin responsibilities
  const getResponsibilities = (adminType) => {
    switch(adminType) {
      case 'SUPER_ADMIN':
        return 'System Configuration, User Management, Security';
      case 'STAFF_ADMIN':
        return 'Staff Scheduling, Reports, Operations';
      case 'SUPPORT_ADMIN':
        return 'Customer Support, Help Desk, Tickets';
      default:
        return 'Basic Operations';
    }
  };


  // Initial load
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  // Apply filters when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admins...</p>
      </div>
    );
  }

  return (
    <div className={`patient-list-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="data-container">
        <div className="data-header">
          <h2 className="data-title">
            <i className="fas fa-user-shield"></i>
            Admin Records ({filteredAdmins.length})
          </h2>

          {/* Fullscreen toggle button */}
          <button 
            className="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="filter-container">
            {/* Status Filter */}
            <select 
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            {/* Admin Type Filter */}
            <select 
              className="filter-select"
              value={filters.adminType}
              onChange={(e) => handleFilterChange('adminType', e.target.value)}
            >
              <option value="">All Admin Types</option>
              <option value="SUPER_ADMIN">Super Admin</option>

              <option value="STAFF_ADMIN">Staff Admin</option>
              <option value="SUPPORT_ADMIN">Support Admin</option>
            </select>

            {/* Search */}
            <input
              type="text"
              className="search-filter"
              placeholder="Search by name, email, or phone..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />

            <button className="refresh-btn" onClick={loadAdmins}>
              <i className="fas fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
            
 
          {filteredAdmins.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-user-shield"></i>
              <p>No admins found matching your criteria.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredAdmins.map((admin, index) => (
                <div key={admin.id || `admin-${index}`} className="patient-card admin-card">
                  <div className="card-header">
                    <div className="patient-image">
                      {admin.adminPhoto ? (
                        <img 
                          src={`data:image/jpeg;base64,${admin.adminPhoto}`}
                          alt={admin.name}
                          className="patient-avatar-large"
                        />
                      ) : (
                        <div className="patient-avatar-placeholder-large">
                          <i className="fas fa-user-shield"></i>
                        </div>
                      )}
                    </div>
                    <div className="patient-basic-info">
                      <h3 className="patient-name">#{admin.id} - {admin.name}</h3>
                      <div className="status-row">
                        {getStatusBadge(admin.status)}
                        {getAdminTypeBadge(admin.adminType)}
 
          
                      </div>

                      </div>


                    <div className="card-actions">
                      <select
                        className="status-select"
                        value={admin.status}
                        onChange={(e) => handleStatusUpdate(admin.id, e.target.value)}
                        title="Update Status"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SUSPENDED">Suspended</option>
                      </select>
                      <button 
                        className="btn-edit"
                        onClick={() => alert(`Edit functionality for ${admin.name} will be implemented`)}
                        title="Edit Admin"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        title="Delete Admin"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <label><i className="fas fa-envelope"></i> Email</label>
                        <span>{admin.email}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-phone"></i> Phone</label>
                        <span>{admin.phone}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-calendar"></i> Created</label>
                        <span>{formatDate(admin.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminList;