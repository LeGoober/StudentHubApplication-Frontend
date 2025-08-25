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

export const register = async (
  userEmail: string, 
  userPassword: string, 
  userFirstName: string, 
  userLastName: string,
  userRole?: string,
  studentNumber?: string,
  staffNumber?: string
) =>
  api.post('/auth/register', { 
    userEmail, 
    userPassword, 
    userFirstName, 
    userLastName,
    ...(userRole && { userRole }),
    ...(studentNumber && { studentNumber }),
    ...(staffNumber && { staffNumber })
  });

// Channel endpoints (updated to match backend)
export const getChannels = async () => api.get('/channel/getAll');
export const createChannel = async (name: string, adminId: number) => api.post('/channel/create', { channelName: name, adminId });
export const getChannel = async (id: number) => api.get(`/channel/read/${id}`);
export const updateChannel = async (id: number, channelData: any) => api.put('/channel/update', { channelId: id, ...channelData });
export const deleteChannel = async (id: number) => api.delete(`/channel/delete/${id}`);

// User endpoints (updated to match backend)
export const getUser = async (id: number) => api.get(`/auth/get/${id}`);
export const updateUser = async (userData: any) => api.put('/auth/update', userData);
export const deleteUser = async (id: number) => api.delete(`/auth/delete/${id}`);
export const getAllUsers = async () => api.get('/auth/getAll');

// Legacy profile endpoints (keeping for compatibility)
export const getProfile = async (id: number) => api.get(`/auth/get/${id}`);
export const updateProfile = async (id: number, profileData: any) => api.put('/auth/update', { userId: id, ...profileData });

// Message endpoints
export const getMessages = async (channelId: number, page = 0, size = 50) => 
  api.get(`/messages/${channelId}?page=${page}&size=${size}`);
export const sendMessage = async (channelId: number, content: string) => 
  api.post('/messages/send', { channelId, content });
export const editMessage = async (messageId: string, content: string) => 
  api.put(`/messages/${messageId}`, { content });
export const deleteMessage = async (messageId: string) => 
  api.delete(`/messages/${messageId}`);

// User presence endpoints
export const getOnlineUsers = async (channelId?: number) => 
  api.get(`/users/online${channelId ? `?channelId=${channelId}` : ''}`);
export const updateUserStatus = async (status: 'online' | 'away' | 'busy' | 'invisible') => 
  api.patch('/users/status', { status });

// Channel membership endpoints
export const joinChannel = async (channelId: number) => api.post(`/channel/join/${channelId}`);
export const leaveChannel = async (channelId: number) => api.delete(`/channel/leave/${channelId}`);
export const getChannelMembers = async (channelId: number) => api.get(`/channel/${channelId}/members`);
