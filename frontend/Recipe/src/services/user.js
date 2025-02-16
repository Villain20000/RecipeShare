import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Add auth header to requests
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Transform user data to ensure avatar path is correct
const transformUserData = (userData) => {
  if (userData && userData.avatar && !userData.avatar.startsWith('http') && !userData.avatar.startsWith('data:')) {
    userData.avatar = userData.avatar.replace(/^\//, '');
  }
  return userData;
};

export const userService = {
  async getCurrentUser() {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: authHeader()
      });
      return transformUserData(response.data);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  async getUserSettings() {
    try {
      const response = await axios.get(`${BASE_URL}/users/settings`, {
        headers: authHeader()
      });
      return transformUserData(response.data);
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  async updateUserSettings(formData) {
    try {
      const response = await axios.put(`${BASE_URL}/users/settings`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return transformUserData(response.data);
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  async updateAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axios.put(`${BASE_URL}/users/avatar`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put(`${BASE_URL}/users/password`, {
        currentPassword,
        newPassword
      }, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  async updateNotificationSettings(settings) {
    const response = await axios.put(`${BASE_URL}/users/notifications`, settings);
    return response.data;
  },

  async getUserRecipes() {
    try {
      const response = await axios.get(`${BASE_URL}/users/recipes`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user recipes:', error);
      throw error;
    }
  },

  async getSavedRecipes() {
    try {
      const response = await axios.get(`${BASE_URL}/users/saved-recipes`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      throw error;
    }
  }
}; 