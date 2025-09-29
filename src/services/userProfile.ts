import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';
import type { Schemas } from '../types/openapi-helpers';

// UserProfileController: /user_profile
export const createUserProfile = async (data: Schemas['UserProfile']) =>
  api.post<OkJson<'create'>>('/user_profile/create', data as ReqJson<'create'>);
export const getUserProfile = async (id: number) => api.get<OkJson<'read'>>(`/user_profile/read/${id}`);
export const updateUserProfile = async (id: number, data: Schemas['UserProfile']) =>
  api.put<OkJson<'update'>>(`/user_profile/update/${id}`, data as ReqJson<'update'>);
export const deleteUserProfile = async (id: number) => api.delete<OkJson<'delete'>>(`/user_profile/delete/${id}`);
export const getAllUserProfiles = async () => api.get('/user_profile/getAll');
export const searchUserProfiles = async (q: string) => api.get(`/user_profile/search?q=${encodeURIComponent(q)}`);
export const searchUserProfilesByEmail = async (email: string) => api.get(`/user_profile/search/email?email=${encodeURIComponent(email)}`);
