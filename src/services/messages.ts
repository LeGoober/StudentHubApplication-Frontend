import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';

export const getMessages = async (channelId: number, page = 0, size = 50) => 
  api.get<OkJson<'getMessages'>>(`/messages/${channelId}?page=${page}&size=${size}`);
export const sendMessage = async (channelId: number, content: string) => 
  api.post<OkJson<'sendMessage'>>('/messages/send', { channelId, content } as ReqJson<'sendMessage'>);
export const editMessage = async (messageId: string, content: string) => 
  api.put<OkJson<'editMessage'>>(`/messages/${messageId}`, { content } as ReqJson<'editMessage'>);
export const deleteMessage = async (messageId: string) => 
  api.delete<OkJson<'deleteMessage'>>(`/messages/${messageId}`);
