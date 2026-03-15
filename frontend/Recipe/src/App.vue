<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import AppLayout from '@/components/AppLayout.vue';
import '@/assets/styles/animations.css';

const authStore = useAuthStore();
const toastStore = useToastStore();
const toasts = ref([]);

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

onMounted(() => {
  // Subscribe to toast events
  toastStore.$subscribe((mutation, state) => {
    if (mutation.type === 'addToast' || mutation.storeId === 'toast') {
      const toast = state.toasts[state.toasts.length - 1];
      if (toast && !toasts.value.find(t => t.id === toast.id)) {
        toasts.value.push(toast);
        
        // Auto remove toast after duration
        setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || 5000);
      }
    }
  });
});
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppLayout>
      <router-view v-slot="{ Component }">
        <transition 
          enter-active-class="transition duration-300 ease-smooth"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </AppLayout>

    <!-- Global Toast Notifications -->
    <div class="fixed bottom-0 right-0 p-6 z-[200] pointer-events-none">
      <transition-group 
        name="toast-list" 
        tag="div" 
        class="flex flex-col gap-3 items-end"
      >
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto bg-white rounded-2xl shadow-elevation-4 p-4 max-w-sm w-full border border-surface-100 flex items-start gap-4 transition-all duration-300"
        >
          <div class="flex-shrink-0 mt-0.5">
            <div 
              v-if="toast.type === 'success'"
              class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div 
              v-else-if="toast.type === 'error'"
              class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div 
              v-else
              class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div class="flex-1 pt-1">
            <h5 class="text-sm font-bold text-surface-900">{{ toast.title }}</h5>
            <p v-if="toast.message" class="text-xs text-surface-500 mt-1">{{ toast.message }}</p>
          </div>
          
          <button 
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Poppins', var(--font-sans);
}

body {
  font-family: var(--font-sans);
  color: theme('colors.surface.900');
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, .font-display {
  font-family: var(--font-display);
}

/* Custom transitions */
.toast-list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-list-leave-active {
  transition: all 0.3s ease-in;
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(2rem) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}

.ease-smooth {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: theme('colors.surface.50');
}
::-webkit-scrollbar-thumb {
  background: theme('colors.surface.200');
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: theme('colors.surface.300');
}
</style>

