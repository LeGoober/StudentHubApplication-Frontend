import api from './client';
import type { OkJson, ReqJson, Schemas } from '../types/openapi-helpers';

// UserPostController: /user_post
export const createUserPost = async (data: Schemas['UserPost']) =>
  api.post<OkJson<'create_2'>>('/user_post/create', data as ReqJson<'create_2'>);
export const getUserPost = async (id: number) => api.get<OkJson<'read_2'>>(`/user_post/get/${id}`);
export const updateUserPost = async (data: Schemas['UserPost']) =>
  api.put<OkJson<'update_2'>>('/user_post/update', data as ReqJson<'update_2'>);
export const deleteUserPost = async (id: number) => api.delete<OkJson<'delete_2'>>(`/user_post/delete/${id}`);
export const getAllUserPosts = async () => api.get<OkJson<'getAll_2'>>('/user_post/getAll');
export const getUserPostsForUser = async (userId: number) => api.get<OkJson<'getByUserId'>>(`/user_post/user/${userId}`);
export const searchUserPosts = async (q: string) => api.get(`/user_post/search?q=${encodeURIComponent(q)}`);
