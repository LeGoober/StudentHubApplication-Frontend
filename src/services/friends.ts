import api from './client';

export const getFriends = async () => api.get('/users/friends');
export const sendFriendRequest = async (userId: number) => api.post('/users/friend-request', { userId });
export const acceptFriendRequest = async (userId: number) => api.post('/users/friend-request/accept', { userId });
export const rejectFriendRequest = async (userId: number) => api.post('/users/friend-request/reject', { userId });
export const removeFriend = async (userId: number) => api.delete(`/users/friends/${userId}`);
export const getFriendRequests = async () => api.get('/users/friend-requests');
export const blockUser = async (userId: number) => api.post('/users/block', { userId });
export const unblockUser = async (userId: number) => api.delete(`/users/block/${userId}`);
export const searchUsers = async (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`);
