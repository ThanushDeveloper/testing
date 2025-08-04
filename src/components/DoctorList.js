import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8080/admin/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to fetch doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="doctor-list">
      <h2>Doctor List</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.name}</h3>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              <p><strong>Status:</strong> {doctor.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;