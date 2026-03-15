import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupErrorHandler } from './middleware/errorHandler'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Initialize error handling
setupErrorHandler(router)

// Use plugins
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')
