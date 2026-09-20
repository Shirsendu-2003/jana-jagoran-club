import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({ baseURL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally by logging the user out; 423 means a forced password change is pending
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('scms_token');
      localStorage.removeItem('scms_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    if (error.response && error.response.status === 423) {
      if (!window.location.pathname.includes('/force-password-change')) {
        window.location.href = '/force-password-change';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
