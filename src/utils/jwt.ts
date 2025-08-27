// JWT utility functions
export const decodeJWT = (token: string): any => {
  try {
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeJWT(token);
  console.log('Decoded JWT token:', decoded);
  
  // Try different possible user ID fields
  const userId = decoded?.userId || decoded?.id || decoded?.user_id;
  
  // If we got a number, return it
  if (typeof userId === 'number') {
    return userId;
  }
  
  // If we got a string that looks like a number, convert it
  if (typeof userId === 'string' && !isNaN(Number(userId))) {
    return Number(userId);
  }
  
  console.log('Could not extract numeric user ID from token. Available fields:', Object.keys(decoded || {}));
  return null;
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get stored token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  return !isTokenExpired(token);
};

// Clear authentication data
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Authentication data cleared');
};

// Validate token format and expiration
export const validateToken = (token: string): boolean => {
  if (!token) return false;
  
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  
  if (isTokenExpired(token)) {
    console.log('Token has expired');
    return false;
  }
  
  return true;
};
