import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupErrorHandler } from './middleware/errorHandler'

import { useAuthStore } from './stores/authStore'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()
app.use(pinia)

// Initialize auth and theme
const authStore = useAuthStore()
authStore.initialize()
authStore.initializeTheme()

// Initialize error handling
setupErrorHandler(router)

// Use plugins
app.use(router)

// Mount app
app.mount('#app')
