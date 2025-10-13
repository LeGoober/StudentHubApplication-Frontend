import api from './client';
import type { OkJson, ReqJson, Schemas } from '../types/openapi-helpers';

export const getEntrepreneurStudents = async () => api.get<OkJson<'getAll_4'>>('/entrepreneur_profile/getAll');
export const getEntrepreneurStudent = async (id: number) => api.get<OkJson<'read_4'>>(`/entrepreneur_profile/read/${id}`);
export const createEntrepreneurStudent = async (data: Schemas['EntrepreneurUserProfile']) =>
  api.post<OkJson<'create_4'>>('/entrepreneur_profile/create', data as ReqJson<'create_4'>);
export const updateEntrepreneurStudent = async (id: number, data: Schemas['EntrepreneurUserProfile']) =>
  api.put<OkJson<'update_4'>>('/entrepreneur_profile/update', ({ id, ...data } as unknown) as ReqJson<'update_4'>);
export const deleteEntrepreneurStudent = async (id: number) => api.delete<OkJson<'delete_4'>>(`/entrepreneur_profile/delete/${id}`);
