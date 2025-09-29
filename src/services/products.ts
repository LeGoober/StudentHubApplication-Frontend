import api from './client';
import type { OkJson, ReqJson, Schemas } from '../types/openapi-helpers';

// ProductController: /products
export const createProduct = async (data: Schemas['Products']) =>
  api.post<OkJson<'create_3'>>('/products/create', data as ReqJson<'create_3'>);
export const getProduct = async (id: number) => api.get<OkJson<'read_3'>>(`/products/read/${id}`);
export const updateProduct = async (data: Schemas['Products']) =>
  api.put<OkJson<'update_3'>>('/products/update', data as ReqJson<'update_3'>);
export const deleteProduct = async (id: number) => api.delete<OkJson<'delete_3'>>(`/products/delete/${id}`);
export const getAllProducts = async () => api.get<OkJson<'getAll_3'>>('/products/getAll');
export const searchProducts = async (q: string) => api.get(`/products/search?q=${encodeURIComponent(q)}`);
export const getProductsByCategory = async (category: string) => api.get(`/products/category/${encodeURIComponent(category)}`);
export const getProductsBySeller = async (sellerId: number) => api.get(`/products/seller/${sellerId}`);
