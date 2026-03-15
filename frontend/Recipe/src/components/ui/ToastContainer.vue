<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()

const iconMap = {
  success: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>`,
  error: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>`,
  warning: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`,
  info: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-brand-50 border-brand-200 text-brand-800'
}

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-brand-500'
}

const progressColorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-brand-500'
}
</script>

<template>
  <teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="[
            'relative flex items-start gap-3 p-4 rounded-xl border shadow-elevation-3 pointer-events-auto overflow-hidden',
            'transition-all duration-300 ease-out hover:shadow-elevation-4',
            colorMap[toast.type]
          ]"
          role="alert"
        >
          <!-- Progress bar for auto-dismiss -->
          <div 
            class="absolute bottom-0 left-0 h-1 transition-all ease-linear"
            :class="progressColorMap[toast.type]"
            :style="{ 
              width: '100%',
              animation: `shrink ${toast.duration || 5000}ms linear forwards`
            }"
          />
          
          <span :class="iconColorMap[toast.type]" v-html="iconMap[toast.type]" />
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            @click="toastStore.removeToast(toast.id)"
            class="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
