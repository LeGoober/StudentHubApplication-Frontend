import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (userEmail: string, userPassword: string) =>
  api.post('/auth/login', { userEmail, userPassword });

export const register = async (userEmail: string, userPassword: string, userFirstName: string, userLastName: string) =>
  api.post('/auth/register', { userEmail, userPassword, userFirstName, userLastName });

export const getChannels = async () => api.get('/channel/getAll');
export const createChannel = async (name: string, adminId: number) => api.post('/channel/create', { name, adminId });
export const getProfile = async (id: number) => api.get(`/user_profile/get/${id}`);
