import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    filterType: 'all',
    searchTerm: '',
    gender: '',
    treatment: '',
    dateFilter: 'all'
  });

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
      let url = '';
      
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

  // Load patients data
  const loadPatients = async () => {
    setLoading(true);
    setError('');
    try {
      let data = [];
      
      // Apply backend filters first
      if (filters.dateFilter !== 'all') {
        data = await fetchPatientsByFilter(filters.dateFilter);
      } else if (filters.gender && filters.filterType === 'gender') {
        data = await fetchPatientsByFilter('gender', filters.gender);
      } else if (filters.treatment && filters.filterType === 'treatment') {
        data = await fetchPatientsByFilter('treatment', filters.treatment);
      } else {
        data = await fetchAllPatients();
      }

      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      setError('Failed to load patients. Please try again.');
      console.error('Error loading patients:', error);
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
    <div className="patient-list-container">
      <div className="data-container">
        <div className="data-header">
          <h2 className="data-title">
            <i className="fas fa-users"></i>
            Patient Records ({filteredPatients.length})
          </h2>
          
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
                handleFilterChange('filterType', e.target.value ? 'gender' : 'all');
              }}
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
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
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Treatment</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">
                    <i className="fas fa-users"></i>
                    <p>No patients found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="patient-image">
                        {patient.patientImage ? (
                          <img 
                            src={`data:image/jpeg;base64,${patient.patientImage}`}
                            alt={patient.name}
                            className="patient-avatar"
                          />
                        ) : (
                          <div className="patient-avatar-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>#{patient.id}</td>
                    <td className="patient-name">{patient.name}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phone}</td>
                    <td>
                      <span className={`gender-badge gender-${patient.gender?.toLowerCase()}`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td>{formatDate(patient.dob)}</td>
                    <td className="address-cell">{patient.address}</td>
                    <td>
                      <span className="treatment-badge">
                        {patient.treatment}
                      </span>
                    </td>
                    <td>{getStatusBadge(patient.status)}</td>
                    <td>{formatDate(patient.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;