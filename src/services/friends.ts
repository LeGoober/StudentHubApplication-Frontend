import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';

export const getFriends = async () => api.get<OkJson<'getFriends'>>('/users/friends');
export const sendFriendRequest = async (userId: number) =>
  api.post<OkJson<'sendFriendRequest'>>('/users/friend-request', { userId } as ReqJson<'sendFriendRequest'>);
export const acceptFriendRequest = async (userId: number) =>
  api.post<OkJson<'acceptFriendRequest'>>('/users/friend-request/accept', { userId } as ReqJson<'acceptFriendRequest'>);
export const rejectFriendRequest = async (userId: number) =>
  api.post<OkJson<'rejectFriendRequest'>>('/users/friend-request/reject', { userId } as ReqJson<'rejectFriendRequest'>);
export const removeFriend = async (userId: number) => api.delete<OkJson<'removeFriend'>>(`/users/friends/${userId}`);
export const getFriendRequests = async () => api.get<OkJson<'getFriendRequests'>>('/users/friend-requests');
export const blockUser = async (userId: number) =>
  api.post<OkJson<'blockUser'>>('/users/block', { userId } as ReqJson<'blockUser'>);
export const unblockUser = async (userId: number) => api.delete<OkJson<'unblockUser'>>(`/users/block/${userId}`);
export const searchUsers = async (query: string) => api.get<OkJson<'searchUsers'>>(`/users/search?q=${encodeURIComponent(query)}`);
