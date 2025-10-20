import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const url = config.url || '';

  // Avoid attaching Authorization header to public auth endpoints
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/api/auth/login') ||
                         url.includes('/auth/register') || url.includes('/api/auth/register');

  if (token && !isAuthEndpoint) {
    // ensure headers object exists
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
    headers: config.headers,
    hasToken: !!token,
    skippedAuthHeaderForAuthEndpoint: isAuthEndpoint
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;
