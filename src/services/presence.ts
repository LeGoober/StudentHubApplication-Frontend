import api from './client';

export const getOnlineUsers = async (channelId?: number) => 
  api.get(`/users/online${channelId ? `?channelId=${channelId}` : ''}`);
export const updateUserStatus = async (status: 'online' | 'away' | 'busy' | 'invisible') => 
  api.patch('/users/status', { status: status.toUpperCase() });
