import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
            <button className="theme-toggle-Home" onClick={toggleTheme} title="Toggle theme">
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} theme-icon`}></i>
            </button>
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


      
      {/* Impact Stats */}
      <section className="stats">
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">500+</div>
              <div className="stat-label">Verified Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Active Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">99.99%</div>
              <div className="stat-label">Platform Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">HIPAA</div>
              <div className="stat-label">GDPR Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="how-content">
          <h2 className="section-title">How Medic Notes Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon"><i className="fas fa-user-plus"></i></div>
              <h3>Create Your Account</h3>
              <p>Sign up as a Doctor, Patient, or Hospital to get a tailored experience.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><i className="fas fa-link"></i></div>
              <h3>Connect & Manage</h3>
              <p>Link profiles, manage records, appointments, and prescriptions securely.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><i className="fas fa-chart-line"></i></div>
              <h3>Track & Improve</h3>
              <p>Monitor health progress and insights to enhance outcomes.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Security */}
      <section className="security">
        <div className="security-content">
          <h2 className="section-title">Enterprise‑grade Security</h2>
          <div className="security-grid">
            <div className="security-card">
              <i className="fas fa-lock"></i>
              <h3>Data Encryption</h3>
              <p>End‑to‑end encryption in transit and at rest using industry standards.</p>
            </div>
            <div className="security-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Access Controls</h3>
              <p>Role‑based access with audit logs to protect sensitive information.</p>
            </div>
            <div className="security-card">
              <i className="fas fa-file-contract"></i>
              <h3>Compliance</h3>
              <p>Designed with HIPAA/GDPR best practices and regional regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonials-content">
          <h2 className="section-title">Trusted by Clinicians and Patients</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="avatar">DR</div>
              <p className="quote">“Medic Notes has streamlined my consultations and reduced paperwork.”</p>
              <p className="author">Dr. R. Sharma, Cardiologist</p>
            </div>
            <div className="testimonial-card">
              <div className="avatar">AN</div>
              <p className="quote">“I can access my prescriptions anywhere—super convenient.”</p>
              <p className="author">Anita N., Patient</p>
            </div>
            <div className="testimonial-card">
              <div className="avatar">HM</div>
              <p className="quote">“Easy onboarding and great visibility across departments.”</p>
              <p className="author">Hospital Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to modernize your medical workflow?</h2>
          <p>Join Medic Notes and digitize your healthcare operations today.</p>
          <button className="cta-btn" onClick={handleLoginClick}>Create your free account</button>
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


