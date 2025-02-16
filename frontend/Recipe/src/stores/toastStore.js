import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    showToast(message, type = 'info', duration = 3000) {
      const id = Date.now();
      this.toasts.push({
        id,
        message,
        type,
        duration
      });

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    },

    success(message, duration) {
      this.showToast(message, 'success', duration);
    },

    error(message, duration) {
      this.showToast(message, 'error', duration);
    },

    info(message, duration) {
      this.showToast(message, 'info', duration);
    },

    warning(message, duration) {
      this.showToast(message, 'warning', duration);
    }
  }
}); 