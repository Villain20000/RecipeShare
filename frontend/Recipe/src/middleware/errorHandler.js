import axios from 'axios';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

export function setupErrorHandler(router) {
  axios.interceptors.response.use(
    response => response,
    error => {
      const authStore = useAuthStore();

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Clear user data and redirect to login
        authStore.signOut();
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }

      // Handle 403 Forbidden errors
      if (error.response?.status === 403) {
        router.push('/403');
      }

      // Handle 404 Not Found errors
      if (error.response?.status === 404) {
        router.push('/404');
      }

      // Handle 500 Server errors
      if (error.response?.status >= 500) {
        router.push('/500');
      }

      return Promise.reject(error);
    }
  );
}

export function setupTokenRefresh() {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axios.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Implement your token refresh logic here
        return new Promise((resolve, reject) => {
          axios.post('/api/auth/refresh', {
            refreshToken: localStorage.getItem('refreshToken')
          })
            .then(({ data }) => {
              authService.setToken(data.token);
              authService.setRefreshToken(data.refreshToken);
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
              originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
              processQueue(null, data.token);
              resolve(axios(originalRequest));
            })
            .catch(err => {
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    }
  );
} 