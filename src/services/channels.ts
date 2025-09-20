import api from './client';

export const getChannels = async () => api.get('/channel/getAll');
export const createChannel = async (channelNameField: string, channelTypeField: string, description?: string) => {
  console.log('API createChannel called with:', { channelNameField, channelTypeField, description });
  
  const requestBody = { 
    channelName: channelNameField,
    channelType: channelTypeField.toUpperCase(),
    ...(description && { description })
  };
  
  console.log('Sending request to /channel/create with body:', requestBody);
  
  try {
    const response = await api.post('/channel/create', requestBody);
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
        const response = await api.post('/channel/create', fallbackBody);
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

export const getChannel = async (id: number) => api.get(`/channel/read/${id}`);
export const updateChannel = async (id: number, channelData: any) => api.put('/channel/update', { channelId: id, ...channelData });
export const deleteChannel = async (id: number) => api.delete(`/channel/delete/${id}`);

// New enhanced channel endpoints
export const getMyChannels = async () => api.get('/channel/my-channels');
export const checkChannelMembership = async (channelId: number) => api.get(`/channel-membership/check-membership/${channelId}`);

// Channel membership
export const joinChannel = async (channelId: number) => api.post(`/channel/join/${channelId}`);
export const leaveChannel = async (channelId: number) => api.delete(`/channel/leave/${channelId}`);
export const getChannelMembers = async (channelId: number) => api.get(`/channel-membership/${channelId}/members`);
