import React, { useState } from 'react';
import axios from 'axios';

    const DoctorRegistration = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    gender: '',
    dob: '',
    status: 'ACTIVE'
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Check backend connectivity
  const checkBackendConnectivity = async () => {
    try {
      const response = await fetch('http://localhost:8080/actuator/health', {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Backend connectivity check failed:', error);
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        alert("You must be logged in to register a doctor.");
        setLoading(false);
        return;
      }

      // Check backend connectivity
      const isConnected = await checkBackendConnectivity();
      if (!isConnected) {
        alert("Cannot connect to backend server. Please ensure the Spring Boot backend is running on port 8080.");
        setLoading(false);
        return;
      }

      // Create FormData for multipart request
      const doctorFormData = new FormData();
      
      // Create doctor object matching backend expectations
      const doctorData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        specialization: formData.specialization,
        gender: formData.gender.toUpperCase(),
        dob: formData.dob,
        status: formData.status
      };

      doctorFormData.append("doctor", JSON.stringify(doctorData));

      // Handle image file
      if (image && image.size > 0) {
        doctorFormData.append("image", image);
      }

      console.log("Submitting doctor data:", doctorData);

      const response = await axios.post(
        "http://localhost:8080/admin/register-doctor",
        doctorFormData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Doctor registration response:", response.data);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        gender: '',
        dob: '',
        status: 'ACTIVE'
      });
      setImage(null);
      e.target.reset();

      // Show success message
      alert("Doctor registered successfully!");

    } catch (error) {
      console.error("Error registering doctor:", error);
      console.error("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Provide specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data || error.response.statusText;

        if (status === 401) {
          alert("Authentication failed. Please log in again.");
          // Clear authentication data and redirect to login
          localStorage.clear();
          window.location.href = '/';
        } else if (status === 400) {
          alert(`Invalid data: ${message}`);
        } else if (status === 409) {
          alert("A doctor with this email or phone already exists.");
        } else if (status === 500) {
          alert(`Server error: ${message}. Please check the server logs for more details.`);
        } else {
          alert(`Server error (${status}): ${message}`);
        }
      } else if (error.request) {
        console.error("Network error - backend may not be running:", error.request);
        alert("Cannot connect to server. Please ensure the backend server is running on http://localhost:8080 and try again.");
      } else {
        alert(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        <i className="fas fa-user-md"></i>
        Register New Doctor
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              className="form-input"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              className="form-input"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select 
              className="form-select" 
              name="gender" 
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <select
              className="form-select"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Specialization</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Surgery">Surgery</option>
              <option value="Physiotherapy">Physiotherapy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              className="form-input"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                specialization: '',
                gender: '',
                dob: '',
                status: 'ACTIVE'
              });
              setImage(null);
            }}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <i className="fas fa-save"></i> 
            {loading ? 'Registering...' : 'Register Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistration;