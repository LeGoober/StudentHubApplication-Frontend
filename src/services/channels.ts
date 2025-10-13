import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';

export const getChannels = async () => api.get<OkJson<'getAll_5'>>('/channel/getAll');
export const getChannelsWithMemberCounts = async () => {
  const response = await api.get<OkJson<'getAll_5'>>('/channel/getAll');
  // The backend should already include activeMemberCount in the response
  // If not, we'll need to fetch it separately for each channel
  return response;
};
export const createChannel = async (channelNameField: string, channelTypeField: string, description?: string) => {
  console.log('API createChannel called with:', { channelNameField, channelTypeField, description });
  
  const requestBody = { 
    channelName: channelNameField,
    channelType: channelTypeField.toUpperCase(),
    ...(description && { description })
  };
  
  console.log('Sending request to /channel/create with body:', requestBody);
  
  try {
    const response = await api.post<OkJson<'create_5'>>('/channel/create', requestBody as ReqJson<'create_5'>);
    console.log('Channel creation API response:', response);
    return response;
  } catch (error: any) {
    console.error('Channel creation failed:', error.response?.status, error.response?.data);
    
    // Try alternative format with "name" field as fallback
    if (error.response?.status === 400) {
      const fallbackBody = { 
        name: channelNameField, 
        channelType: channelTypeField.toUpperCase(),
        ...(description && { description })
      };
      
      console.log('Trying fallback format with "name" field:', fallbackBody);
      try {
        const response = await api.post<OkJson<'create_5'>>('/channel/create', fallbackBody as ReqJson<'create_5'>);
        console.log('Channel creation API response (fallback):', response);
        return response;
      } catch (fallbackError) {
        console.error('Fallback format also failed');
        throw error; // Throw original error
      }
    }
    
    throw error;
  }
};

export const getChannel = async (id: number) => api.get<OkJson<'read_5'>>(`/channel/read/${id}`);
export const updateChannel = async (id: number, channelData: any) => api.put<OkJson<'update_5'>>('/channel/update', { channelId: id, ...channelData });
export const deleteChannel = async (id: number) => api.delete(`/channel/delete/${id}`);

// New enhanced channel endpoints
export const getMyChannels = async () => api.get<OkJson<'getMyChannels'>>('/channel/my-channels');
// Membership-related endpoints live in channelMembership.ts
export const joinChannel = async (channelId: number) => api.post<OkJson<'joinChannel'>>(`/channel/join/${channelId}`);
export const leaveChannel = async (channelId: number) => api.delete<OkJson<'leaveChannel'>>(`/channel/leave/${channelId}`);
export const checkMembership = async (channelId: number) => api.get<OkJson<'checkMembership'>>(`/channel/check-membership/${channelId}`);

