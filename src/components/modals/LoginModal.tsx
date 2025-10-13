import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, getUser } from '../../services/api';
import { setToken, setUser } from '../../store/slices/authSlice';
import { getUserIdFromToken } from '../../utils/jwt';
import { websocketService } from '../../services/websocket';
import Input from '../ui/Input';
import Button from '../ui/Button';
import AuthHeader from '../layout/AuthHeader';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup, onLoginSuccess }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!userEmail || !userPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      console.log('Attempting login with:', { email: userEmail });
      const response = await login(userEmail, userPassword);
      
      // Handle different response formats - backend might return just token string or object with token
      let token: string;
      let user: any = null;
      
      if (typeof response.data === 'string') {
        // Backend returns token as string
        token = response.data;
      } else if (response.data.token) {
        // Backend returns object with token and optionally user
        token = response.data.token;
        user = response.data.user;
      } else {
        // Fallback - if backend returns an object without token, fail clearly
        throw new Error('Login response did not include a token');
      }
      
      console.log('Login response:', response.data);
      console.log('Extracted token:', token);
      
      // Store token
      localStorage.setItem('token', token);
      dispatch(setToken(token));
      
      // Store user data directly from response or fetch it
      if (user) {
        dispatch(setUser(user));
      } else {
        // Get user ID from token and fetch user details
        const userId = getUserIdFromToken(token);
        if (userId) {
          try {
            const userResponse = await getUser(userId);
            dispatch(setUser(userResponse.data));
          } catch (userError) {
            console.error('Failed to fetch user details:', userError);
            // Continue with login even if user fetch fails
          }
        }
      }
      
      // Reset form
      setUserEmail('');
      setUserPassword('');
      
      console.log('Login successful, calling success callback');
      
      // Reconnect WebSocket with new token
      websocketService.reconnectWithToken();
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access forbidden. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message && !error.message.includes('Network Error')) {
        errorMessage = `Login error: ${error.message}`;
      } else if (error.message && error.message.includes('Network Error')) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <AuthHeader title="Welcome Back" subtitle="Sign in to your account" />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;