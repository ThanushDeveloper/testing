import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Medic Notes</h1>
          </div>
          <nav className="nav">
            <button className="login-btn" onClick={handleLoginClick}>
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Digitize Your Medical Journey with Medic Notes
          </h1>
          <p className="hero-subtitle">
            Streamline healthcare management with our comprehensive digital platform. 
            Connect doctors, patients, and hospitals in one secure, efficient ecosystem.
          </p>
          <button className="cta-btn" onClick={handleLoginClick}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2 className="features-title">Empowering Healthcare Professionals</h2>
          <div className="features-grid">
            {/* Doctor Card */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>For Doctors</h3>
              <p>
                Manage patient records, create digital prescriptions, track medical history,
                and collaborate with other healthcare providers seamlessly.
              </p>
              <ul className="feature-list">
                <li>Digital prescription management</li>
                <li>Patient history tracking</li>
                <li>Secure communication</li>
                <li>Appointment scheduling</li>
              </ul>
            </div>

            {/* Patient Card */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>For Patients</h3>
              <p>
                Access your complete medical records, view prescriptions, schedule appointments,
                and stay connected with your healthcare team from anywhere.
              </p>
              <ul className="feature-list">
                <li>Personal health records</li>
                <li>Prescription history</li>
                <li>Appointment management</li>
                <li>Health progress tracking</li>
              </ul>
            </div>

            {/* Hospital Card */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hospital"></i>
              </div>
              <h3>For Hospitals</h3>
              <p>
                Centralize hospital operations, manage staff and patients, maintain comprehensive
                records, and ensure regulatory compliance with ease.
              </p>
              <ul className="feature-list">
                <li>Staff management system</li>
                <li>Patient database</li>
                <li>Compliance reporting</li>
                <li>Resource optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Medic Notes</h3>
            <p>Transforming healthcare through digital innovation</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: support@medicnotes.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medic Notes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
