import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { setToken } from '../store/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginScreen: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      const response = await login(userEmail, userPassword);
      localStorage.setItem('token', response.data);
      dispatch(setToken(response.data));
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed: Invalid email or password';
      setError(errorMessage);
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to CPUT StudentHub</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
};

export default LoginScreen;
