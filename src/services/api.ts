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

export const getChannels = async () => api.get('/channel/getAll');
export const createChannel = async (name: string, adminId: number) => api.post('/channel/create', { name, adminId });
export const getProfile = async (id: number) => api.get(`/user_profile/read/${id}`);
export const updateProfile = async (id: number, profileData: any) => api.put(`/user_profile/update/${id}`, profileData);

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
