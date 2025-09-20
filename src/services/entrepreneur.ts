import api from './client';

export const getEntrepreneurStudents = async () => api.get('/entrepreneur_profile/getAll');
export const getEntrepreneurStudent = async (id: number) => api.get(`/entrepreneur_profile/read/${id}`);
export const createEntrepreneurStudent = async (data: any) => api.post('/entrepreneur_profile/create', data);
export const updateEntrepreneurStudent = async (id: number, data: any) => api.put('/entrepreneur_profile/update', { id, ...data });
export const deleteEntrepreneurStudent = async (id: number) => api.delete(`/entrepreneur_profile/delete/${id}`);
