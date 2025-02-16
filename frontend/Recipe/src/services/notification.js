import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Add auth header to requests
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notificationService = {
  async getNotifications() {
    try {
      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
      const response = await axios.put(`${BASE_URL}/notifications/read-all`, {}, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}; 