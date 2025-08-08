import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';
function Login({ setAuth }) {
  const navigate = useNavigate();
  
  // State management
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error messages when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Message handlers
  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
  };

  const hideMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Mock authentication function
 const authenticateUser = async (credentials) => {
  let url = '';
  let payload = {};
  
  switch (credentials.role) {
    case 'admin':
      url = 'http://localhost:8080/auth/admin/login';
      break;
    case 'doctor':
      url = 'http://localhost:8080/auth/doctor/login';
      break;
    case 'patient':
      url = 'http://localhost:8080/auth/patient/login';
      break;
    default:
      throw new Error('Invalid role selected');
  }

  // Determine the login identifier
  if (!credentials.username || !credentials.password) {
    throw new Error('Missing username or password');
  }

  if (/^\d+$/.test(credentials.username)) {
    // Only digits: Treat as phone number
    payload = { phone: credentials.username, password: credentials.password };
  } else if (credentials.username.includes('@')) {
    // Contains @: Treat as email
    payload = { email: credentials.username, password: credentials.password };
  } else {
    // Else: Treat as role-based ID (adminId, doctorId)
    const idField = credentials.role === 'admin' ? 'adminId' : credentials.role === 'doctor' ? 'doctorId' : 'patientId';
    payload = { [idField]: credentials.username, password: credentials.password };
  }





  // Send POST request
  const response = await axios.post(url, payload);

  // Return the actual user data from backend response
  const userData = response.data.user || response.data;


  return {
    success: true,
    user: {
      id: response.data.id || userData.id || Date.now(),
      username: credentials.username,
      role: credentials.role.toUpperCase(),
      name: userData.name || userData.fullName || `${credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)} User`,
      email: userData.email || credentials.username,
      phone: userData.phone,
      address: userData.address,
      dob: userData.dob,
      gender: userData.gender,
      image: userData.image,
      department: userData.department,
      status: userData.status || 'ACTIVE',
      token: response.data.token || userData.token
    }
  };
};


  // Google OAuth Mock Function
  const authenticateWithGoogle = (role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.9) { // 90% success rate
          resolve({
            success: true,
            user: {
              id: Date.now(),
              username: 'google.user@gmail.com',
              role: role.toUpperCase(),
              name: 'Google User',
              provider: 'google'
            }
          });
        } else {
          reject(new Error('Google authentication failed. Please try again.'));
        }
      }, 1500);
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    hideMessages();

    // Basic validation
    if (!formData.role) {
      showError('Please select your role');
      return;
    }

    if (!formData.username || !formData.password) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const result = await authenticateUser(formData);

      if (result.success) {
        showSuccess('Login successful! Redirecting to dashboard...');
        
        // Store user session
        localStorage.setItem('authToken', result.user.token);
        localStorage.setItem('userSession', JSON.stringify(result.user));
        // Store the ID separately for easy access
        localStorage.setItem('userId', result.user.id);
        
        // Show loading overlay
        setShowLoadingOverlay(true);
        
        // Update auth state and redirect
        setTimeout(() => {
          setAuth({
            isAuthenticated: true,
            role: result.user.role,
            username: result.user.username,
            user: result.user
          });
          
          // Navigate to appropriate dashboard based on role
          const dashboardRoute = `/${result.user.role.toLowerCase()}/dashboard`;
          navigate(dashboardRoute);
          
          setShowLoadingOverlay(false);
        }, 2000);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    hideMessages();

    if (!formData.role) {
      showError('Please select your role before signing in with Google');
      return;
    }

    try {
      setIsGoogleLoading(true);
      const result = await authenticateWithGoogle(formData.role);

      if (result.success) {
        showSuccess('Google login successful! Redirecting to dashboard...');
        
        // Store user session
        localStorage.setItem('userSession', JSON.stringify(result.user));
        // Store the ID separately for easy access
        localStorage.setItem('userId', result.user.id);
        
        // Show loading overlay
        setShowLoadingOverlay(true);
        
        // Update auth state and redirect
        setTimeout(() => {
          setAuth({
            isAuthenticated: true,
            role: result.user.role,
            username: result.user.username,
            user: result.user
          });
          
          // Navigate to appropriate dashboard based on role
          const dashboardRoute = `/${result.user.role.toLowerCase()}/dashboard`;
          navigate(dashboardRoute);
          
          setShowLoadingOverlay(false);
        }, 2000);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} style={{position:'absolute'}}>
        <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} theme-icon`}></i>
      </button>

      {/* Main Container */}
      <div className="login-content">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="logo-container" style={{padding:'0'}}>
            <i className="fas fa-stethoscope logo-icon" style={{paddingTop:'10px',width:'fit-content',paddingLeft:'10px',paddingRight:'10px'}}></i>
          </div>
          <h2 className="login-title">Welcome to MedicNotes</h2>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="form-container">
         

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <i className="fas fa-user-tag label-icon"></i>
                Select Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Choose your role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <i className="fas fa-user label-icon"></i>
                Phone or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your username or email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock label-icon"></i>
                Password
              </label>
              <div className="password-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control password-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row">
              <div className="checkbox-group">
                {/* <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox"
                /> */}
                {/* <label htmlFor="rememberMe" className="checkbox-label">
                  Remember me
                </label> */}
              </div>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="message error-message show">
                <i className="fas fa-exclamation-circle message-icon"></i>
                <span>{errorMessage}</span>
              </div>
            )}

{/* 
             Error Message
          <div className={`message error-message ${errorMessage ? 'show' : ''}`}>
            <i className="fas fa-exclamation-circle message-icon"></i>
            <span>{errorMessage}</span>
          </div> */}

          {/* Success Message */}
          {/* <div className={`message success-message ${successMessage ? 'show' : ''}`}>
            <i className="fas fa-check-circle message-icon"></i>
            <span>{successMessage}</span>
          </div> */}

            {/* Success Message */}
            {/* {successMessage && (
              <div className="message success-message show">
                <i className="fas fa-check-circle message-icon"></i>
                <span>{successMessage}</span>
              </div>
            )} */}


            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <span>Sign In</span>
              <i className={`fas fa-spinner spinner ${isLoading ? '' : 'hidden'}`}></i>
            </button>

            {/* Divider */}
            {/* <div className="divider">
              <span className="divider-text">Or continue with</span>
            </div> */}

            {/* Google Login Button */}
            {/* <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
              <i className={`fas fa-spinner spinner ${isGoogleLoading ? '' : 'hidden'}`}></i>
            </button> */}

            {/* Demo Credentials */}
            {/* <div className="demo-info">
              <p className="demo-title">Demo Credentials:</p>
              <div className="demo-credentials">
                <div className="demo-credential">
                  <strong>Patient:</strong> patient@test.com / patient123
                </div>
                <div className="demo-credential">
                  <strong>Doctor:</strong> doctor@test.com / doctor123
                </div>
                <div className="demo-credential">
                  <strong>Admin:</strong> admin@test.com / admin123
                </div>
              </div>
            </div> */}
          </form>

          {/* Sign Up Link */}
          {/* <div className="signup-section">
            <p>
              Don't have an account?{' '}
              <a href="#" className="signup-link">
                Sign up here
              </a>
            </p>
          </div> */}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2024 HealthCare. All rights reserved.</p>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className={`loading-overlay ${showLoadingOverlay ? 'show' : ''}`}>
        <div className="loading-content">
          <div className="loading-spinner">
            <i className="fas fa-spinner"></i>
          </div>
          <h3 className="loading-title">Signing you in...</h3>
          <p className="loading-text">Please wait while we verify your credentials</p>
        </div>
      </div>
    </div>
  );
}

export default Login;