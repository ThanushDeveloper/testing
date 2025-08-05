import React, { useState } from 'react';
import axios from 'axios';

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE',
    adminType: 'STAFF_ADMIN'
  });
  const [adminPhoto, setAdminPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setAdminPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Create FormData for multipart request
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('password', formData.password);
      submitData.append('status', formData.status);
      submitData.append('adminType', formData.adminType);
      
      if (adminPhoto) {
        submitData.append('adminPhoto', adminPhoto);
      } else {
        // Create a dummy file if no photo is selected
        const dummyFile = new File([''], 'dummy.txt', { type: 'text/plain' });
        submitData.append('adminPhoto', dummyFile);
      }

      const response = await axios.post(
        'http://localhost:8080/admin/register',
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage('Admin registered successfully!');
      setMessageType('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'ACTIVE',
        adminType: 'STAFF_ADMIN'
      });
      setAdminPhoto(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error registering admin:', error);
      const errorMessage = error.response?.data || 'Failed to register admin. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-container">
      <div className="data-header">
        <h2 className="data-title">
          <i className="fas fa-user-shield"></i>
          Register New Admin
        </h2>
        <p className="data-subtitle">Add a new administrator to the system</p>
      </div>

      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
          {message}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter admin's full name"
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
                value={formData.phone}
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
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter secure password"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Type *</label>
              <select
                className="form-select"
                name="adminType"
                value={formData.adminType}
                onChange={handleInputChange}
                required
              >
                <option value="STAFF_ADMIN">Staff Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SUPPORT_ADMIN">Support Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <input
                type="file"
                className="form-input"
                onChange={handleFileChange}
                accept="image/*"
              />
              <small className="form-help">Optional: Upload admin profile photo</small>
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
                  status: 'ACTIVE',
                  adminType: 'STAFF_ADMIN'
                });
                setAdminPhoto(null);
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
                setMessage('');
              }}
            >
              <i className="fas fa-times"></i> Clear Form
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
                  <i className="fas fa-user-plus"></i> Register Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;