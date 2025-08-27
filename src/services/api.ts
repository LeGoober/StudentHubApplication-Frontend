import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
    headers: config.headers,
    hasToken: !!token
  });
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Try multiple login endpoint formats
const tryMultipleLoginEndpoints = async (userEmail: string, userPassword: string) => {
  console.log('🔄 Attempting login API call...');
  console.log('📧 Email:', userEmail);
  console.log('🌐 API URL:', API_URL);
  
  // Try multiple endpoint formats to find the correct one
  const loginAttempts = [
    { endpoint: '/auth/login', body: { userEmail, userPassword } },
    { endpoint: '/api/auth/login', body: { email: userEmail, password: userPassword } },
    { endpoint: '/auth/login', body: { email: userEmail, password: userPassword } },
    { endpoint: '/api/auth/login', body: { userEmail, userPassword } }
  ];
  
  for (const attempt of loginAttempts) {
    try {
      console.log(`🎯 Trying endpoint: ${attempt.endpoint} with body:`, attempt.body);
      const response = await api.post(attempt.endpoint, attempt.body);
      console.log('✅ Login successful with endpoint:', attempt.endpoint);
      return response;
    } catch (error: any) {
      console.log(`❌ Failed with ${attempt.endpoint}:`, error.response?.status, error.response?.data);
      if (attempt === loginAttempts[loginAttempts.length - 1]) {
        // This is the last attempt, throw the error
        throw error;
      }
    }
  }
  
  // Fallback - should never reach here
  throw new Error('All login attempts failed');
};

export const login = async (userEmail: string, userPassword: string) => {
  return tryMultipleLoginEndpoints(userEmail, userPassword);
};

// Try multiple register endpoint formats
const tryMultipleRegisterEndpoints = async (
  userEmail: string,
  userPassword: string,
  userFirstName: string,
  userLastName: string,
  userRole?: string,
  studentNumber?: string,
  staffNumber?: string
) => {
  console.log('🔄 Attempting registration API call...');
  console.log('📧 Email:', userEmail);
  console.log('🌐 API URL:', API_URL);
  
  // Try multiple endpoint formats to find the correct one
  const registerAttempts = [
    { 
      endpoint: '/auth/register', 
      body: { 
        userEmail, 
        userPassword, 
        userFirstName, 
        userLastName,
        ...(userRole && { userRole }),
        ...(studentNumber && { studentNumber }),
        ...(staffNumber && { staffNumber })
      } 
    },
    { 
      endpoint: '/api/auth/register', 
      body: { 
        email: userEmail, 
        password: userPassword, 
        firstName: userFirstName, 
        lastName: userLastName,
        ...(userRole && { role: userRole }),
        ...(studentNumber && { studentNumber }),
        ...(staffNumber && { staffNumber })
      } 
    }
  ];
  
  for (const attempt of registerAttempts) {
    try {
      console.log(`🎯 Trying registration endpoint: ${attempt.endpoint} with body:`, attempt.body);
      const response = await api.post(attempt.endpoint, attempt.body);
      console.log('✅ Registration successful with endpoint:', attempt.endpoint);
      return response;
    } catch (error: any) {
      console.log(`❌ Registration failed with ${attempt.endpoint}:`, error.response?.status, error.response?.data);
      if (attempt === registerAttempts[registerAttempts.length - 1]) {
        // This is the last attempt, throw the error
        throw error;
      }
    }
  }
  
  // Fallback - should never reach here
  throw new Error('All registration attempts failed');
};

export const register = async (
  userEmail: string, 
  userPassword: string, 
  userFirstName: string, 
  userLastName: string,
  userRole?: string,
  studentNumber?: string,
  staffNumber?: string
) => {
  return tryMultipleRegisterEndpoints(userEmail, userPassword, userFirstName, userLastName, userRole, studentNumber, staffNumber);
};

// Channel endpoints (updated to match backend)
export const getChannels = async () => api.get('/channel/getAll');
export const createChannel = async (channelNameField: string, channelTypeField: string, description?: string) => {
  console.log('API createChannel called with:', { channelNameField, channelTypeField, description });
  
  // Backend expects either "channelName" or "name" field based on PERSISTENCE_GUIDE.md
  const requestBody = { 
    channelName: channelNameField,  // Primary field name from backend docs
    channelType: channelTypeField.toUpperCase(), // Ensure enum format
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

// User endpoints (updated to match backend)
export const getUser = async (id: number) => api.get(`/auth/get/${id}`);
export const updateUser = async (userData: any) => api.put('/auth/update', userData);
export const deleteUser = async (id: number) => api.delete(`/auth/delete/${id}`);
export const getAllUsers = async () => api.get('/auth/getAll');

// Legacy profile endpoints (keeping for compatibility)
export const getProfile = async (id: number) => api.get(`/auth/get/${id}`);
export const updateProfile = async (id: number, profileData: any) => api.put('/auth/update', { userId: id, ...profileData });

// Message endpoints
export const getMessages = async (channelId: number, page = 0, size = 50) => 
  api.get(`/messages/${channelId}?page=${page}&size=${size}`);
export const sendMessage = async (channelId: number, content: string) => 
  api.post('/messages/send', { channelId, content });
export const editMessage = async (messageId: string, content: string) => 
  api.put(`/messages/${messageId}`, { content });
export const deleteMessage = async (messageId: string) => 
  api.delete(`/messages/${messageId}`);

// User presence endpoints
export const getOnlineUsers = async (channelId?: number) => 
  api.get(`/users/online${channelId ? `?channelId=${channelId}` : ''}`);
export const updateUserStatus = async (status: 'online' | 'away' | 'busy' | 'invisible') => 
  api.patch('/users/status', { status: status.toUpperCase() });

// Enhanced Channel membership endpoints (aligned with backend changes)
export const joinChannel = async (channelId: number) => api.post(`/channel/join/${channelId}`);
export const leaveChannel = async (channelId: number) => api.delete(`/channel/leave/${channelId}`);
export const getChannelMembers = async (channelId: number) => api.get(`/channel-membership/${channelId}/members`);

// Friend/Follow system endpoints
export const getFriends = async () => api.get('/users/friends');
export const sendFriendRequest = async (userId: number) => api.post('/users/friend-request', { userId });
export const acceptFriendRequest = async (userId: number) => api.post('/users/friend-request/accept', { userId });
export const rejectFriendRequest = async (userId: number) => api.post('/users/friend-request/reject', { userId });
export const removeFriend = async (userId: number) => api.delete(`/users/friends/${userId}`);
export const getFriendRequests = async () => api.get('/users/friend-requests');
export const blockUser = async (userId: number) => api.post('/users/block', { userId });
export const unblockUser = async (userId: number) => api.delete(`/users/block/${userId}`);

// Search users for friend requests
export const searchUsers = async (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`);
