import { defineStore } from 'pinia';
import { notificationService } from '@/services/notification';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    isNotificationsOpen: false,
    loading: false,
    error: null,
    isEnabled: false
  }),

  getters: {
    hasUnread: (state) => state.isEnabled && state.unreadCount > 0,
    sortedNotifications: (state) => [...state.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  actions: {
    async fetchNotifications() {
      if (!this.isEnabled) return;

      this.loading = true;
      this.error = null;
      try {
        const data = await notificationService.getNotifications();
        this.notifications = data.notifications;
        this.unreadCount = data.notifications.filter(n => !n.read).length;
      } catch (error) {
        this.error = null;
        this.isEnabled = false;
        console.log('Notifications not available');
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notificationId) {
      if (!this.isEnabled) return;
      
      try {
        await notificationService.markAsRead(notificationId);
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          this.unreadCount--;
        }
      } catch (error) {
        console.log('Could not mark notification as read');
      }
    },

    async markAllAsRead() {
      if (!this.isEnabled) return;

      try {
        await notificationService.markAllAsRead();
        this.notifications.forEach(n => {
          if (!n.read) {
            n.read = true;
          }
        });
        this.unreadCount = 0;
      } catch (error) {
        console.log('Could not mark all notifications as read');
      }
    },

    toggleNotifications() {
      this.isNotificationsOpen = !this.isNotificationsOpen;
    },

    closeNotifications() {
      this.isNotificationsOpen = false;
    },

    addNotification(notification) {
      if (!this.isEnabled) return;
      
      this.notifications.unshift(notification);
      if (!notification.read) {
        this.unreadCount++;
      }
    }
  }
}); 