// Authentication utility functions

export const handleAuthError = (error, onLogout = null) => {
  if (error.response && error.response.status === 401) {
    alert("Your session has expired. Please log in again.");
    
    // Clear all authentication data
    localStorage.clear();
    
    // Use the provided logout function or fallback to window.location
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.href = '/';
    }
    
    return true; // Indicates that authentication error was handled
  }
  
  return false; // Not an authentication error
};

export const clearAuthData = () => {
  localStorage.clear();
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUserSession = () => {
  try {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const session = getUserSession();
  return !!(token && session);
};