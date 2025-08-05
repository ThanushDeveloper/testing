import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    username: "",
    email: "",
    userId: null
  });

  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userSession = localStorage.getItem('userSession');
    
    if (token && userSession) {
      try {
        const user = JSON.parse(userSession);
        setAuth({
          isAuthenticated: true,
          role: user.role,
          username: user.username,
          email: user.email || "",
          userId: user.id || null
        });

        // If user is admin, fetch profile data
        if (user.role === 'ADMIN') {
          fetchUserProfile();
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
        // Clear invalid session data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        localStorage.removeItem('adminProfile');
      }
    }
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      
      // Check if profile is already cached
      const cachedProfile = localStorage.getItem('adminProfile');
      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        setUserProfile(profile);
        setProfileLoading(false);
        return;
      }

      // For demo purposes, create mock profile data
      // In production, this would fetch from the backend API
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const user = JSON.parse(userSession);
        const mockProfile = {
          id: user.id || 1,
          name: user.name || 'Admin User',
          email: user.email || user.username,
          phone: '+1 (555) 123-4567',
          status: 'ACTIVE',
          adminType: 'SUPER_ADMIN',
          adminPhoto: null, // No photo for demo
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          updatedAt: new Date().toISOString()
        };
        
        setUserProfile(mockProfile);
        localStorage.setItem('adminProfile', JSON.stringify(mockProfile));
      }

      // Uncomment below for real API integration
      // const profile = await authService.getCurrentAdminProfile();
      // if (profile) {
      //   setUserProfile(profile);
      //   localStorage.setItem('adminProfile', JSON.stringify(profile));
      // }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      // For now, we'll use the existing mock authentication
      // This can be updated later to use the real API
      const result = await authenticateUser(credentials);
      
      if (result.success) {
        const userData = {
          isAuthenticated: true,
          role: result.user.role,
          username: result.user.username,
          email: result.user.email || result.user.username,
          userId: result.user.id
        };

        setAuth(userData);
        
        // Store user session
        localStorage.setItem('authToken', result.user.token);
        localStorage.setItem('userSession', JSON.stringify(result.user));
        
        // If admin, fetch profile
        if (result.user.role === 'ADMIN') {
          await fetchUserProfile();
        }

        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  // Mock authentication function (keeping existing logic for now)
  const authenticateUser = async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let url, payload;
    
    // Determine the endpoint and payload based on role and username format
    if (credentials.role === 'admin') {
      url = '/auth/admin/login';
      
      // Check if username is email, phone, or ID
      if (credentials.username.includes('@')) {
        payload = { email: credentials.username, password: credentials.password };
      } else if (/^\d+$/.test(credentials.username)) {
        payload = { phone: credentials.username, password: credentials.password };
      } else {
        payload = { adminId: credentials.username, password: credentials.password };
      }
    } else if (credentials.role === 'doctor') {
      url = '/auth/doctor/login';
      if (credentials.username.includes('@')) {
        payload = { email: credentials.username, password: credentials.password };
      } else if (/^\d+$/.test(credentials.username)) {
        payload = { phone: credentials.username, password: credentials.password };
      } else {
        payload = { doctorId: credentials.username, password: credentials.password };
      }
    } else if (credentials.role === 'patient') {
      url = '/auth/patient/login';
      if (credentials.username.includes('@')) {
        payload = { email: credentials.username, password: credentials.password };
      } else if (/^\d+$/.test(credentials.username)) {
        payload = { phone: credentials.username, password: credentials.password };
      } else {
        payload = { patientId: credentials.username, password: credentials.password };
      }
    }

    // Mock successful response with realistic admin data
    const adminNames = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'];
    const randomName = adminNames[Math.floor(Math.random() * adminNames.length)];
    
    return {
      success: true,
      user: {
        id: Date.now(),
        username: credentials.username,
        email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@medicnotes.com`,
        role: credentials.role.toUpperCase(),
        name: credentials.username.includes('@') ? 'Admin User' : randomName,
        token: `mock-token-${Date.now()}`
      }
    };
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setAuth({
      isAuthenticated: false,
      role: null,
      username: "",
      email: "",
      userId: null
    });
    setUserProfile(null);
  };

  // Refresh profile data
  const refreshProfile = async () => {
    localStorage.removeItem('adminProfile');
    await fetchUserProfile();
  };

  const value = {
    auth,
    setAuth,
    userProfile,
    profileLoading,
    login,
    logout,
    fetchUserProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;