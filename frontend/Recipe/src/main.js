import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupErrorHandler } from './middleware/errorHandler'

const app = createApp(App)
const pinia = createPinia()

// Initialize error handling
setupErrorHandler(router)

app.use(pinia)
app.use(router)

app.mount('#app')
