import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
});

// Request Interceptor to attach Authorization Header automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle common API errors (like 401 token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 Unauthorized, we can clear token if it was expired
    if (error.response && error.response.status === 401) {
      const errors = error.response.data?.errors || [];
      if (errors.includes('Token expired') || errors.includes('Invalid token')) {
        localStorage.removeItem('token');
        // Let the client app reload or reset state via AuthContext
      }
    }
    return Promise.reject(error);
  }
);

export default api;
