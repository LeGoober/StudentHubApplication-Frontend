import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';

export const getOnlineUsers = async (channelId?: number) => 
  api.get<OkJson<'getOnlineUsers'>>(`/users/online${channelId ? `?channelId=${channelId}` : ''}`);
export const updateUserStatus = async (status: 'online' | 'away' | 'busy' | 'invisible') => 
  api.patch<OkJson<'updateStatus'>>('/users/status', { status: status.toUpperCase() } as ReqJson<'updateStatus'>);
