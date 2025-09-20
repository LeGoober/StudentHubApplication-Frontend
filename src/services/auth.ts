import api, { API_URL } from './client';

// Try multiple login endpoint formats
export const tryMultipleLoginEndpoints = async (userEmail: string, userPassword: string) => {
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

// Register (single known endpoint)
export const register = async (
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

  const endpoint = '/auth/register';
  const body = {
    userEmail,
    userPassword,
    userFirstName,
    userLastName,
    ...(userRole && { userRole }),
    ...(studentNumber && { studentNumber }),
    ...(staffNumber && { staffNumber })
  };

  try {
    console.log(`🎯 Sending registration request to ${endpoint} with body:`, body);
    const response = await api.post(endpoint, body);
    console.log('✅ Registration successful with endpoint:', endpoint);
    return response;
  } catch (error: any) {
    console.log(`❌ Registration failed with ${endpoint}:`, error.response?.status, error.response?.data);
    throw error; // propagate the error
  }
};

// User CRUD
export const getUser = async (id: number) => api.get(`/auth/get/${id}`);
export const updateUser = async (userData: any) => api.put('/auth/update', userData);
export const deleteUser = async (id: number) => api.delete(`/auth/delete/${id}`);
export const getAllUsers = async () => api.get('/auth/getAll');

// Legacy profile endpoints
export const getProfile = async (id: number) => api.get(`/auth/get/${id}`);
export const updateProfile = async (id: number, profileData: any) => api.put('/auth/update', { userId: id, ...profileData });
