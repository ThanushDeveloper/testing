import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PatientList.css';


const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    filterType: 'all',
    searchTerm: '',
    gender: 'all',
    treatment: '',
    dateFilter: 'all'
  });

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Fetch all patients
  const fetchAllPatients = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8080/api/patients/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all patients:', error);
      throw error;
    }
  };

  // Fetch patients by specific filters
  const fetchPatientsByFilter = async (filterType, value) => {
    try {
      const token = getAuthToken();
      let url = "";

      switch (filterType) {
        case 'gender':
          url = `http://localhost:8080/api/patients/by-gender/${value}`;
          break;
        case 'name':
          url = `http://localhost:8080/api/patients/by-name/${value}`;
          break;
        case 'phone':
          url = `http://localhost:8080/api/patients/by-phone/${value}`;
          break;
        case 'treatment':
          url = `http://localhost:8080/api/patients/by-treatment/${value}`;
          break;
        case 'today':
          url = 'http://localhost:8080/api/patients/registered-today';
          break;
        case 'yesterday':
          url = 'http://localhost:8080/api/patients/registered-yesterday';
          break;
        case 'thisWeek':
          url = 'http://localhost:8080/api/patients/registered-this-week';
          break;
        case 'thisMonth':
          url = 'http://localhost:8080/api/patients/registered-this-month';
          break;
        case 'date':
          url = `http://localhost:8080/api/patients/registered-on/${value}`;
          break;
        default:
          return await fetchAllPatients();
      }
    

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching patients by ${filterType}:`, error);
      throw error;
    }
  };

  // Load patients data with improved error handling
  const loadPatients = async () => {
    setLoading(true);
    setError('');
    try {
      let data = [];
  

      // Apply backend filters - fix the logic to prevent errors
      if (filters.dateFilter && filters.dateFilter !== 'all') {
        try {
          data = await fetchPatientsByFilter(filters.dateFilter, null);
        } catch (error) {
          console.warn(`Time filter ${filters.dateFilter} failed, falling back to all patients:`, error);
          data = await fetchAllPatients();
        }
      } else if (filters.gender && filters.gender !== 'all' && filters.filterType === 'gender') {
        try {
          data = await fetchPatientsByFilter('gender', filters.gender);
        } catch (error) {
          console.warn(`Gender filter failed, falling back to all patients:`, error);
          data = await fetchAllPatients();
        }
      } else if (filters.treatment && filters.filterType === 'treatment') {
        try {
          data = await fetchPatientsByFilter('treatment', filters.treatment);
        } catch (error) {
          console.warn(`Treatment filter failed, falling back to all patients:`, error);
          data = await fetchAllPatients();
        }
      } else {
        data = await fetchAllPatients();
      }
            

      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      setError('Failed to load patients. Please try again.');
      console.error('Error loading patients:', error);
      // Set empty arrays to prevent further errors
      setPatients([]);
      setFilteredPatients([]);

    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for search
  const applyClientFilters = () => {

    let filtered = [...patients];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(filters.searchTerm)
      );
       
    }

    setFilteredPatients(filtered);
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
      loadPatients();
      return;

    }

    setLoading(true);
    try {
      const data = await fetchPatientsByFilter(type, value.trim());
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      setError(`Failed to search patients by ${type}`);
    } finally {
      setLoading(false);
    }
  };




  // Delete patient
  const handleDeletePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8080/api/patients/delete/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the list
      loadPatients();
      alert('Patient deleted successfully!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again.');
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
    loadPatients();
  }, [filters.dateFilter, filters.filterType]);

  // Apply client-side filters when search term changes
  useEffect(() => {
    applyClientFilters();
  }, [filters.searchTerm, patients]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className={`patient-list-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>

      <div className="data-container">
        <div className="data-header">
          <h2 className="data-title">
            <i className="fas fa-users"></i>
            Patient Records ({filteredPatients.length})
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
            {/* Date Range Filter */}
            <select 
              className="filter-select" 
              value={filters.dateFilter}
              onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Registered Today</option>
              <option value="yesterday">Registered Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>

            {/* Gender Filter */}
            <select 
              className="filter-select"
              value={filters.gender}
              onChange={(e) => {
                handleFilterChange('gender', e.target.value);
                handleFilterChange('filterType', e.target.value && e.target.value !== 'all' ? 'gender' : 'all');

              }}
            >
              <option value="all">All Genders</option>

              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>

            </select>

            {/* Treatment Filter */}
            <select 
              className="filter-select"
              value={filters.treatment}
              onChange={(e) => {
                handleFilterChange('treatment', e.target.value);
                handleFilterChange('filterType', e.target.value ? 'treatment' : 'all');
              }}
            >
              <option value="">All Treatments</option>
              <option value="Physiotherapy">Physiotherapy</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General">General</option>
            </select>

            {/* General Search */}
            <input
              type="text"
              className="search-filter"
              placeholder="Search by name, email, or phone..."
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
            </div>

            <button className="refresh-btn" onClick={loadPatients}>
              <i className="fas fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          {filteredPatients.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-users"></i>
              <p>No patients found matching your criteria.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredPatients.map((patient, index) => (
                <div key={patient.patientId || `patient-${index}`} className="patient-card">
                  <div className="card-header">
                    <div className="patient-image">
                      {patient.patientImage ? (
                        <img 
                          src={`data:image/jpeg;base64,${patient.patientImage}`}
                          alt={patient.name}
                          className="patient-avatar-large"
                        />
                      ) : (
                        <div className="patient-avatar-placeholder-large">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>
                    <div className="patient-basic-info">
                      <h3 className="patient-name">#{patient.id} - {patient.name}</h3>
                      <div className="status-row">
                        {getStatusBadge(patient.status)}
                        <span className={`gender-badge gender-${patient.gender?.toLowerCase()}`}>
                          {patient.gender}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => alert(`Edit functionality for ${patient.name} will be implemented`)}
                        title="Edit Patient"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePatient(patient.id)}
                        title="Delete Patient"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <label><i className="fas fa-envelope"></i> Email</label>
                        <span>{patient.email}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-phone"></i> Phone</label>
                        <span>{patient.phone}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-birthday-cake"></i> Date of Birth</label>
                        <span>{formatDate(patient.dob)}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-hourglass-half"></i> Age</label>
                        <span>{patient.dob ? Math.floor((new Date() - new Date(patient.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} years</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-map-marker-alt"></i> Address</label>
                        <span className="address-text">{patient.address}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-id-card"></i> Emergency Contact</label>
                        <span>{patient.emergencyContact || 'Not provided'}</span>
                      </div>
                      <div className="info-item specialization-item">
                        <label><i className="fas fa-stethoscope"></i> Treatment</label>
                        <span className="treatment-badge">{patient.treatment}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-calendar"></i> Registered</label>
                        <span>{formatDate(patient.createdAt)}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-clock"></i> Last Visit</label>
                        <span>{patient.lastVisit ? formatDate(patient.lastVisit) : 'No visits yet'}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-notes-medical"></i> Medical History</label>
                        <span className="address-text">{patient.medicalHistory || 'No history recorded'}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-pills"></i> Allergies</label>
                        <span className="address-text">{patient.allergies || 'None known'}</span>
                      </div>
                      <div className="info-item">
                        <label><i className="fas fa-heartbeat"></i> Blood Group</label>
                        <span className="treatment-badge">{patient.bloodGroup || 'Unknown'}</span>
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

export default PatientList;


