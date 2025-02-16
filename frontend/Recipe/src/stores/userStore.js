import { defineStore } from 'pinia';
import { authService } from '@/services/auth';
import { useToastStore } from './toastStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,
    preferences: {
      theme: localStorage.getItem('theme') || 'light',
      notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
      language: localStorage.getItem('language') || 'en'
    },
    lastLoginAt: localStorage.getItem('lastLoginAt'),
    savedRecipes: [],
    recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  }),

  getters: {
    currentUser: (state) => state.user,
    hasError: (state) => !!state.error,
    isDarkMode: (state) => state.preferences.theme === 'dark',
    notificationsEnabled: (state) => state.preferences.notifications,
    userLanguage: (state) => state.preferences.language,
    getRecentlyViewed: (state) => state.recentlyViewed
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      
      try {
        if (!email || !password) {
          const error = new Error('Please enter both email and password');
          toastStore.error(error.message);
          throw error;
        }

        const response = await authService.login(email, password);
        
        if (!response.token || !response.user) {
          const error = new Error('Invalid response from server');
          toastStore.error(error.message);
          throw error;
        }

        this.user = response.user;
        this.isAuthenticated = true;
        this.lastLoginAt = new Date().toISOString();
        localStorage.setItem('lastLoginAt', this.lastLoginAt);
        toastStore.success('Welcome back!');
        return response;
      } catch (error) {
        let errorMessage;
        
        if (error.response?.status === 401) {
          errorMessage = 'Invalid email or password';
        } else {
          errorMessage = error.response?.data?.message || 
            error.message || 
            'Unable to log in. Please try again.';
        }
        
        this.error = errorMessage;
        toastStore.error(errorMessage);
        
        console.error('Login error:', {
          status: error.response?.status,
          message: errorMessage,
          originalError: error.message,
          stack: error.stack
        });
        
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async signup(username, email, password) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      
      try {
        const response = await authService.signup(username, email, password);
        this.user = response.user;
        this.isAuthenticated = true;
        toastStore.success('Account created successfully!');
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || 'Signup failed';
        toastStore.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      authService.logout();
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      const toastStore = useToastStore();
      toastStore.success('Logged out successfully');
    },

    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences };
      localStorage.setItem('theme', this.preferences.theme);
      localStorage.setItem('notifications', JSON.stringify(this.preferences.notifications));
      localStorage.setItem('language', this.preferences.language);
    },

    toggleTheme() {
      const newTheme = this.preferences.theme === 'light' ? 'dark' : 'light';
      this.updatePreferences({ theme: newTheme });
    },

    toggleNotifications() {
      this.updatePreferences({ notifications: !this.preferences.notifications });
    },

    setLanguage(language) {
      this.updatePreferences({ language });
    },

    addToRecentlyViewed(recipe) {
      const maxItems = 10;
      this.recentlyViewed = [recipe, ...this.recentlyViewed.filter(item => item.id !== recipe.id)].slice(0, maxItems);
      localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
    },

    setUser(userData) {
      if (userData) {
        this.user = {
          ...this.user,
          ...userData,
          avatar: userData.avatar || this.user?.avatar || null
        };
        this.isAuthenticated = true;
      } else {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async updateProfile(userData) {
      this.loading = true;
      const toastStore = useToastStore();
      
      try {
        const response = await authService.updateProfile(userData);
        this.user = response.data;
        toastStore.success('Profile updated successfully');
        return response.data;
      } catch (error) {
        toastStore.error('Failed to update profile');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(currentPassword, newPassword) {
      this.loading = true;
      const toastStore = useToastStore();
      
      try {
        await authService.changePassword(currentPassword, newPassword);
        toastStore.success('Password changed successfully');
      } catch (error) {
        toastStore.error('Failed to change password');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
}); 