import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getChannels = (token: string) =>
    axios.get(`${API_URL}/channel/getAll`, { headers: { Authorization: `Bearer ${token}` } });

export const createChannel = (name: string, adminId: number, token: string) =>
    axios.post(`${API_URL}/channel/create`, { name, adminCreatedBy: adminId }, { headers: { Authorization: `Bearer ${token}` } });

export const getProfiles = (token: string) =>
    axios.get(`${API_URL}/user_profile/getAll`, { headers: { Authorization: `Bearer ${token}` } });

export const getProfile = (id: number, token: string) =>
    axios.get(`${API_URL}/user_profile/read/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const getPosts = (token: string) =>
    axios.get(`${API_URL}/user_post/getAll`, { headers: { Authorization: `Bearer ${token}` } });

export const login = (email: string, password: string) =>
    axios.post(`${API_URL}/auth/login`, { email, password });

export const register = (email: string, password: string, firstName: string, lastName: string) =>
    axios.post(`${API_URL}/auth/register`, { email, password, firstName, lastName });