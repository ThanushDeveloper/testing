import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PatientList.css';


const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [filters, setFilters] = useState({

  filterType: 'all',
    searchTerm: '',
    gender: 'all',
    specialization: '',
    status: 'all'
  });

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Fetch all doctors
  const fetchAllDoctors = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8080/admin/AllDoctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
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
        case 'email':
          url = `http://localhost:8080/admin/ByDoctorEmail/${value}`;
          break;
        case 'phone':
          url = `http://localhost:8080/admin/ByDoctorPhone/${value}`;
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
      return response.data;
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
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  // Load doctors data with improved error handling
  const loadDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      let data = [];

      // Apply backend filters
      if (filters.gender && filters.gender !== 'all' && filters.filterType === 'gender') {
        try {
          data = await fetchDoctorsByFilter('gender', filters.gender);
        } catch (error) {
          console.warn(`Gender filter failed, falling back to all doctors:`, error);
          data = await fetchAllDoctors();
        }
      } else if (filters.specialization && filters.filterType === 'specialization') {
        try {
          data = await fetchDoctorsByFilter('specialization', filters.specialization);
        } catch (error) {
          console.warn(`Specialization filter failed, falling back to all doctors:`, error);
          data = await fetchAllDoctors();
        }
      } else if (filters.status && filters.status !== 'all' && filters.filterType === 'status') {
        try {
          data = await fetchDoctorsByFilter('status', filters.status);
        } catch (error) {
          console.warn(`Status filter failed, falling back to all doctors:`, error);
          data = await fetchAllDoctors();
        }
      } else {
        data = await fetchAllDoctors();
      }

      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      setError('Failed to load doctors. Please try again.');
      console.error('Error loading doctors:', error);
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for search
  const applyClientFilters = () => {
    let filtered = [...doctors];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchLower) ||
        doctor.email.toLowerCase().includes(searchLower) ||
        doctor.phone.includes(filters.searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchLower)
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

  // Handle search by specific field
  const handleSpecificSearch = async (type, value) => {
    if (!value.trim()) {
      loadDoctors();
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDoctorsByFilter(type, value.trim());
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      setError(`Failed to search doctors by ${type}`);
    } finally {
      setLoading(false);
    }
  };

  // Update doctor status
  const handleUpdateStatus = async (doctorId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the doctor's status to ${newStatus}?`)) {
      return;
    }
    try {
      const token = getAuthToken();
      await axios.put(`http://localhost:8080/admin/UpdateDoctorStatus/${doctorId}?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the list
      loadDoctors();
      alert('Doctor status updated successfully!');
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Failed to update doctor status. Please try again.');
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8080/admin/deleteDoctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the list
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
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
  }, [filters.filterType]);

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
    <div className={`patient-list-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>

      <div className="data-container">
        <div className="data-header">
          <h2 className="data-title">
            <i className="fas fa-user-md"></i>
            Doctor Records ({filteredDoctors.length})
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
                placeholder="Search by email"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSpecificSearch('email', e.target.value);
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
            </div>

            <button className="refresh-btn" onClick={loadDoctors}>
              <i className="fas fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          {filteredDoctors.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-user-md"></i>
              <p>No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredDoctors.map((doctor) => (

                <div key={doctor.id} className="patient-card doctor-card">
                  <div className="card-header">
                    <div className="patient-image">
                      {doctor.doctor_image ? (
                        <img 
                          src={`data:image/jpeg;base64,${doctor.doctor_image}`}
                          alt={doctor.name}
                          className="patient-avatar-large"
                        />
                      ) : (
                        <div className="patient-avatar-placeholder-large">
                          <i className="fas fa-user-md"></i>
                        </div>
                      )}
                    </div>
                    <div className="patient-basic-info">
                      <h3 className="patient-name">#{doctor.id} - {doctor.name}</h3>
                      <div className="status-row">
                        {getStatusBadge(doctor.status)}
                        <span className={`gender-badge gender-${doctor.gender?.toLowerCase()}`}>
                          {doctor.gender}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => alert(`Edit functionality for ${doctor.name} will be implemented`)}
                        title="Edit Doctor"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className={`btn-status ${doctor.status === 'ACTIVE' ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => handleUpdateStatus(doctor.id, doctor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                        title={doctor.status === 'ACTIVE' ? 'Deactivate Doctor' : 'Activate Doctor'}
                      >
                        <i className={`fas ${doctor.status === 'ACTIVE' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        title="Delete Doctor"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <label><i className="fas fa-envelope"></i> Email</label>
                        <span>{doctor.email}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-phone"></i> Phone</label>
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-birthday-cake"></i> Date of Birth</label>
                        <span>{formatDate(doctor.dob)}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-hourglass-half"></i> Age</label>
                        <span>{doctor.dob ? Math.floor((new Date() - new Date(doctor.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} years</span>
                      </div>
                      <div className="info-item specialization-item">
                        <label><i className="fas fa-stethoscope"></i> Specialization</label>
                        <span className="treatment-badge specialization-badge">{doctor.specialization}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-graduation-cap"></i> Qualification</label>
                        <span>{doctor.qualification || 'MD'}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-calendar"></i> Joined</label>
                        <span>{formatDate(doctor.createdAt)}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-star"></i> Experience</label>
                        <span>{doctor.experience || 'Not specified'} years</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-hospital"></i> Department</label>
                        <span className="treatment-badge">{doctor.department || doctor.specialization}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-clock"></i> Consultation Fee</label>
                        <span>${doctor.consultationFee || '50'}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-users"></i> Patients Served</label>
                        <span>{doctor.patientsServed || '0'}</span>
                      </div>
                      <div className="info-item specialization-item">
                        <label><i className="fas fa-certificate"></i> License Number</label>
                        <span>{doctor.licenseNumber || 'Not provided'}</span>
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

export default DoctorList;