import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  // Login function
  async login(credentials) {
    try {
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

      const response = await api.post(url, payload);
      
      return {
        success: true,
        data: response.data,
        token: response.data.token
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get current admin profile
  async getCurrentAdminProfile() {
    try {
      const userSession = localStorage.getItem('userSession');
      if (!userSession) {
        throw new Error('No user session found');
      }

      const user = JSON.parse(userSession);
      
      // If we have admin email from session, fetch full profile
      if (user.role === 'ADMIN' && user.email) {
        const response = await api.get(`/admin/get-by-email?email=${user.email}`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw new Error('Failed to fetch profile data');
    }
  },

  // Get admin by email (for fetching profile data)
  async getAdminByEmail(email) {
    try {
      const response = await api.get(`/admin/get-by-email?email=${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch admin data');
    }
  },

  // Convert byte array to base64 image URL
  convertToImageUrl(byteArray) {
    if (!byteArray || byteArray.length === 0) {
      return null;
    }
    
    // Convert byte array to base64
    const base64String = btoa(
      new Uint8Array(byteArray).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    return `data:image/jpeg;base64,${base64String}`;
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminProfile');
  }
};

export default authService;