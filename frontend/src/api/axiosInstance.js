import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          // Attempt refresh
          const res = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken: newAccess, refreshToken: newRefresh, user } = res.data;
          
          useAuthStore.getState().setAuth(user, newAccess, newRefresh);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
