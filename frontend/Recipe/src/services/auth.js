import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const authService = {
  async login(email, password) {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Make login request
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
      });
      
      // Validate response
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Login successful:', {
        userId: response.data.user._id,
        username: response.data.user.username
      });
      
      return response.data;
    } catch (error) {
      console.error('Login request failed:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        error: error.message
      });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 404) {
        throw new Error('Server not available. Please try again later.');
      } else if (!error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      // For other errors, throw with original message
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async signup(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/users/signup`, {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signup request failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.logout(); // Clear potentially corrupted data
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

// Add axios interceptors
axios.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login and signup requests
    if (config.url?.includes('/login') || config.url?.includes('/signup')) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (except for login/signup)
    if (error.response?.status === 401 && 
        !error.config.url?.includes('/login') && 
        !error.config.url?.includes('/signup')) {
      // Just clear auth data and let the component handle the redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
); 