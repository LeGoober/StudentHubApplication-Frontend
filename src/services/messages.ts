import api from './client';

export const getMessages = async (channelId: number, page = 0, size = 50) => 
  api.get(`/messages/${channelId}?page=${page}&size=${size}`);
export const sendMessage = async (channelId: number, content: string) => 
  api.post('/messages/send', { channelId, content });
export const editMessage = async (messageId: string, content: string) => 
  api.put(`/messages/${messageId}`, { content });
export const deleteMessage = async (messageId: string) => 
  api.delete(`/messages/${messageId}`);
