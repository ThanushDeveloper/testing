import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

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
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
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

      {/* Statistics Section */}
      <section className="stats">
        <div className="stats-content">
          <h2 className="stats-title">Trusted by Healthcare Professionals Worldwide</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Hospitals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Patient Records</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-content">
          <h2 className="section-title">How Medic Notes Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Register & Verify</h3>
                <p>Create your account and complete verification process. Healthcare professionals undergo additional credential verification.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Set Up Profile</h3>
                <p>Complete your professional or patient profile with relevant information and preferences.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Start Managing</h3>
                <p>Begin managing patient records, prescriptions, appointments, and healthcare communications.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Collaborate & Track</h3>
                <p>Collaborate with healthcare teams and track patient progress through our integrated platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-content">
          <h2 className="section-title">Why Choose Medic Notes?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Enterprise Security</h3>
              <p>HIPAA-compliant platform with end-to-end encryption, secure data storage, and regular security audits.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Optimized</h3>
              <p>Access your data anywhere, anytime with our responsive design and dedicated mobile applications.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Gain insights with comprehensive reporting, patient trends, and healthcare analytics dashboard.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock technical support and customer service to ensure uninterrupted healthcare delivery.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Real-time Sync</h3>
              <p>Instant synchronization across all devices and platforms for seamless healthcare coordination.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-cog"></i>
              </div>
              <h3>Customizable</h3>
              <p>Tailor the platform to your specific workflow with customizable templates and configurations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-content">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p>"Medic Notes has revolutionized how we manage patient care. The interface is intuitive and the security features give us complete confidence."</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Dr. Sarah Chen</h4>
                    <span>Chief Medical Officer, City General Hospital</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p>"As a patient, having access to all my medical records in one place has been incredibly empowering. The mobile app is fantastic."</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Michael Rodriguez</h4>
                    <span>Patient</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p>"The administrative efficiency we've gained is remarkable. Our staff can focus on patient care instead of paperwork."</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Jennifer Adams</h4>
                    <span>Hospital Administrator, Metro Health Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Healthcare Experience?</h2>
          <p>Join thousands of healthcare professionals who trust Medic Notes for their digital healthcare needs.</p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={handleLoginClick}>
              Start Free Trial
            </button>
            <button className="cta-secondary">
              Schedule Demo
            </button>
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
