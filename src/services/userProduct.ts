import api from './client';
import type { OkJson, ReqJson, Schemas } from '../types/openapi-helpers';

// UserProductController: /user_product
export const createUserProduct = async (data: Schemas['UserProduct']) =>
  api.post<OkJson<'create_1'>>('/user_product/create', data as ReqJson<'create_1'>);
export const getUserProduct = async (id: number) => api.get<OkJson<'read_1'>>(`/user_product/get/${id}`);
export const updateUserProduct = async (data: Schemas['UserProduct']) =>
  api.put<OkJson<'update_1'>>('/user_product/update', data as ReqJson<'update_1'>);
export const deleteUserProduct = async (id: number) => api.delete<OkJson<'delete_1'>>(`/user_product/delete/${id}`);
export const getAllUserProducts = async () => api.get('/user_product/getAll');
export const getUserProductsByUser = async (userId: number) => api.get(`/user_product/user/${userId}`);
export const getUserProductsByProduct = async (productId: number) => api.get(`/user_product/product/${productId}`);
