import React, { useState } from 'react';
import axios from 'axios';

const DoctorRegistration = () => {
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    gender: '',
    dob: '',
    status: 'ACTIVE'
  });
  const [doctorImage, setDoctorImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        setMessageType('error');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB');
        setMessageType('error');
        return;
      }
      setDoctorImage(file);
      setMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    const { name, email, phone, password, specialization, gender, dob } = doctorData;
    
    if (!name.trim()) {
      setMessage('Doctor name is required');
      setMessageType('error');
      return false;
    }
    
    if (!email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }
    
    if (!phone.trim()) {
      setMessage('Phone number is required');
      setMessageType('error');
      return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setMessage('Please enter a valid phone number');
      setMessageType('error');
      return false;
    }
    
    if (!password.trim()) {
      setMessage('Password is required');
      setMessageType('error');
      return false;
    }
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return false;
    }
    
    if (!specialization) {
      setMessage('Specialization is required');
      setMessageType('error');
      return false;
    }
    
    if (!gender) {
      setMessage('Gender is required');
      setMessageType('error');
      return false;
    }
    
    if (!dob) {
      setMessage('Date of birth is required');
      setMessageType('error');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const token = getAuthToken();
      
      // Create FormData for multipart request
      const formData = new FormData();
      formData.append('doctor', JSON.stringify(doctorData));
      
      if (doctorImage) {
        formData.append('image', doctorImage);
      }
      
      const response = await axios.post(
        'http://localhost:8080/admin/register-doctor',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage('Doctor registered successfully!');
      setMessageType('success');
      
      // Reset form
      setDoctorData({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        gender: '',
        dob: '',
        status: 'ACTIVE'
      });
      setDoctorImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('doctor-image');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Error registering doctor:', error);
      const errorMessage = error.response?.data || 'Failed to register doctor. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setDoctorData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      gender: '',
      dob: '',
      status: 'ACTIVE'
    });
    setDoctorImage(null);
    setMessage('');
    
    // Reset file input
    const fileInput = document.getElementById('doctor-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="doctor-registration-container">
      <div className="form-container">
        <h2 className="form-title">
          <i className="fas fa-user-md"></i>
          Register New Doctor
        </h2>
        
        {message && (
          <div className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={doctorData.name}
                onChange={handleInputChange}
                placeholder="Enter doctor's full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={doctorData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                name="phone"
                value={doctorData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={doctorData.password}
                onChange={handleInputChange}
                placeholder="Enter password (min 6 characters)"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <select
                className="form-select"
                name="specialization"
                value={doctorData.specialization}
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
                <option value="Gynecology">Gynecology</option>
                <option value="Oncology">Oncology</option>
                <option value="Radiology">Radiology</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                className="form-select"
                name="gender"
                value={doctorData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                className="form-input"
                name="dob"
                value={doctorData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={doctorData.status}
                onChange={handleInputChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Doctor Image</label>
            <input
              type="file"
              id="doctor-image"
              className="form-input"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small className="form-help">
              Upload doctor's photo (optional). Max size: 5MB. Supported formats: JPG, PNG, GIF
            </small>
            {doctorImage && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(doctorImage)} 
                  alt="Doctor preview" 
                  className="preview-image"
                />
                <span className="image-name">{doctorImage.name}</span>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              <i className="fas fa-times"></i> Reset
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Register Doctor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;