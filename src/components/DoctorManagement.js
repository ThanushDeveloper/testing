import React, { useState } from 'react';
import DoctorRegistration from './DoctorRegistration';
import DoctorList from './DoctorList';

const DoctorManagement = () => {
  const [activeTab, setActiveTab] = useState('register');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="doctor-management-container">
      <div className="page-header">
        <nav className="breadcrumb">
          <span>Dashboard</span>
          <i className="fas fa-chevron-right"></i>
          <span>Doctor Management</span>
        </nav>
        <h1 className="page-title">Doctor Management</h1>
        <p className="page-subtitle">
          Manage doctor registrations and view doctor information.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => handleTabChange('register')}
        >
          <i className="fas fa-user-md"></i> Register Doctor
        </button>
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => handleTabChange('list')}
        >
          <i className="fas fa-list"></i> Doctor List
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
        {activeTab === 'register' && (
          <div className="tab-content active">
            <DoctorRegistration />
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="tab-content active">
            <DoctorList />
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;