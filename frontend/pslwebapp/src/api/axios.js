import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Django API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // store token after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
