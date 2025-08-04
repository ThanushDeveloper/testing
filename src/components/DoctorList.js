import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [filters, setFilters] = useState({
    filterType: 'all',
    searchTerm: '',
    gender: 'all',
    specialization: '',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Fetch all doctors with pagination
  const fetchAllDoctors = async (page = 0, size = 10) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`http://localhost:8080/admin/AllDoctors?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.doctors) {
        return response.data;
      } else {
        // If response format is different, handle it
        return {
          doctors: Array.isArray(response.data) ? response.data : [],
          currentPage: page,
          totalPages: 1,
          totalItems: Array.isArray(response.data) ? response.data.length : 0,
          pageSize: size
        };
      }
    } catch (error) {
      console.error('Error fetching all doctors:', error);
      throw error;
    }
  };

  // Fetch doctors by specific filters
  const fetchDoctorsByFilter = async (filterType, value) => {
    try {
      const token = getAuthToken();
      let url = "";

      switch (filterType) {
        case 'gender':
          url = `http://localhost:8080/admin/ByDoctorGender/${value}`;
          break;
        case 'name':
          url = `http://localhost:8080/admin/ByDoctorName/${value}`;
          break;
        case 'phone':
          url = `http://localhost:8080/admin/ByDoctorPhone/${value}`;
          break;
        case 'email':
          url = `http://localhost:8080/admin/ByDoctorEmail/${value}`;
          break;
        case 'specialization':
          url = `http://localhost:8080/admin/ByDoctorSpecialization/${value}`;
          break;
        case 'status':
          url = `http://localhost:8080/admin/ByDoctorStatus/${value}`;
          break;
        default:
          return await fetchAllDoctors();
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle different response formats
      const doctorsData = Array.isArray(response.data) ? response.data : [response.data];
      return {
        doctors: doctorsData,
        currentPage: 0,
        totalPages: 1,
        totalItems: doctorsData.length,
        pageSize: doctorsData.length
      };
    } catch (error) {
      console.error(`Error fetching doctors by ${filterType}:`, error);
      throw error;
    }
  };

  // Fetch all specializations
  const fetchSpecializations = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8080/admin/DoctorsAllSpecializations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpecializations(response.data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  // Load doctors data
  const loadDoctors = async (page = 0) => {
    setLoading(true);
    setError('');
    try {
      let data = {};

      // Apply backend filters
      if (filters.gender && filters.gender !== 'all' && filters.filterType === 'gender') {
        data = await fetchDoctorsByFilter('gender', filters.gender);
      } else if (filters.specialization && filters.filterType === 'specialization') {
        data = await fetchDoctorsByFilter('specialization', filters.specialization);
      } else if (filters.status && filters.status !== 'all' && filters.filterType === 'status') {
        data = await fetchDoctorsByFilter('status', filters.status);
      } else {
        data = await fetchAllDoctors(page, pagination.pageSize);
      }

      setDoctors(data.doctors || []);
      setPagination({
        currentPage: data.currentPage || 0,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
        pageSize: data.pageSize || 10
      });

    } catch (error) {
      setError('Failed to load doctors. Please try again.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters
  const applyClientFilters = () => {
    let filtered = [...doctors];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name?.toLowerCase().includes(searchLower) ||
        doctor.email?.toLowerCase().includes(searchLower) ||
        doctor.phone?.includes(filters.searchTerm) ||
        doctor.specialization?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDoctors(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle specific search
  const handleSpecificSearch = async (type, value) => {
    if (!value.trim()) return;
    
    setLoading(true);
    try {
      const data = await fetchDoctorsByFilter(type, value);
      setDoctors(data.doctors || []);
      setPagination({
        currentPage: 0,
        totalPages: 1,
        totalItems: data.doctors?.length || 0,
        pageSize: data.doctors?.length || 0
      });
    } catch (error) {
      setError(`No doctors found with ${type}: ${value}`);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8080/admin/deleteDoctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reload doctors after deletion
      loadDoctors(pagination.currentPage);
      alert('Doctor deleted successfully');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (doctorId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this doctor?`)) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.put(`http://localhost:8080/admin/UpdateDoctorStatus/${doctorId}?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reload doctors after status update
      loadDoctors(pagination.currentPage);
      alert(`Doctor status updated to ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Failed to update doctor status. Please try again.');
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadDoctors(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format status
  const getStatusBadge = (status) => {
    const statusClass = status === 'ACTIVE' ? 'status-active' : 'status-inactive';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  // Initial load
  useEffect(() => {
    loadDoctors();
    fetchSpecializations();
  }, [filters.filterType, filters.gender, filters.specialization, filters.status]);

  // Apply client-side filters when search term changes
  useEffect(() => {
    applyClientFilters();
  }, [filters.searchTerm, doctors]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="doctor-list-container">
      <div className="data-container">
        <div className="data-header">
          <h2 className="data-title">
            <i className="fas fa-user-md"></i>
            Doctor Records ({filteredDoctors.length})
          </h2>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="filter-container">
            {/* Gender Filter */}
            <select 
              className="filter-select"
              value={filters.gender}
              onChange={(e) => {
                handleFilterChange('gender', e.target.value);
                handleFilterChange('filterType', e.target.value !== 'all' ? 'gender' : 'all');
              }}
            >
              <option value="all">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Specialization Filter */}
            <select 
              className="filter-select"
              value={filters.specialization}
              onChange={(e) => {
                handleFilterChange('specialization', e.target.value);
                handleFilterChange('filterType', e.target.value ? 'specialization' : 'all');
              }}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select 
              className="filter-select"
              value={filters.status}
              onChange={(e) => {
                handleFilterChange('status', e.target.value);
                handleFilterChange('filterType', e.target.value !== 'all' ? 'status' : 'all');
              }}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            {/* General Search */}
            <input
              type="text"
              className="search-filter"
              placeholder="Search by name, email, phone, or specialization..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />

            {/* Specific Search Options */}
            <div className="specific-search-container">
              <input
                type="text"
                className="search-filter"
                placeholder="Search by name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSpecificSearch('name', e.target.value);
                  }
                }}
              />
              <input
                type="text"
                className="search-filter"
                placeholder="Search by phone"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSpecificSearch('phone', e.target.value);
                  }
                }}
              />
              <input
                type="text"
                className="search-filter"
                placeholder="Search by email"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSpecificSearch('email', e.target.value);
                  }
                }}
              />
            </div>

            <button className="refresh-btn" onClick={() => loadDoctors()}>
              <i className="fas fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    <i className="fas fa-user-md"></i>
                    <p>No doctors found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-image">
                        {doctor.doctor_image ? (
                          <img 
                            src={`data:image/jpeg;base64,${doctor.doctor_image}`}
                            alt={doctor.name}
                            className="doctor-avatar"
                          />
                        ) : (
                          <div className="doctor-avatar-placeholder">
                            <i className="fas fa-user-md"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>#{doctor.id}</td>
                    <td className="doctor-name">{doctor.name}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td>
                      <span className={`gender-badge gender-${doctor.gender?.toLowerCase()}`}>
                        {doctor.gender}
                      </span>
                    </td>
                    <td>{formatDate(doctor.dob)}</td>
                    <td>
                      <span className="specialization-badge">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td>{getStatusBadge(doctor.status)}</td>
                    <td>{formatDate(doctor.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => alert(`Edit functionality for Dr. ${doctor.name} will be implemented`)}
                          title="Edit Doctor"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className={`btn-status ${doctor.status === 'ACTIVE' ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() => handleStatusUpdate(doctor.id, doctor.status)}
                          title={`${doctor.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Doctor`}
                        >
                          <i className={`fas ${doctor.status === 'ACTIVE' ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          title="Delete Doctor"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {pagination.currentPage * pagination.pageSize + 1} to {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} doctors
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              
              <span className="pagination-current">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;