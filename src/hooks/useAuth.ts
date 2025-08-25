import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setToken, setUser, logout } from '../store/slices/authSlice';
import { getUser } from '../services/api';
import { getUserIdFromToken, isTokenExpired } from '../utils/jwt';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        // Check if token is expired
        if (isTokenExpired(savedToken)) {
          dispatch(logout());
          return;
        }

        // Set token in store if not already set
        if (!token) {
          dispatch(setToken(savedToken));
        }

        // Load user details if not already loaded
        if (!user) {
          const userId = getUserIdFromToken(savedToken);
          if (userId) {
            try {
              const userResponse = await getUser(userId);
              dispatch(setUser(userResponse.data));
            } catch (error) {
              console.error('Failed to load user details:', error);
              // If user fetch fails, might be invalid token
              dispatch(logout());
            }
          }
        }
      }
    };

    initializeAuth();
  }, [dispatch, token, user]);

  return {
    isAuthenticated: isAuthenticated || Boolean(token || localStorage.getItem('token')),
    user,
    token
  };
};
