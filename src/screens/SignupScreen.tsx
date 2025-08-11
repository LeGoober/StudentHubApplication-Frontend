import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { setToken } from '../store/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';

const SignupScreen: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError('');
      const response = await register(userEmail, userPassword, userFirstName, userLastName);
      localStorage.setItem('token', response.data);
      dispatch(setToken(response.data));
      navigate('/');
    } catch (error) {
      setError('Signup failed: Please check your inputs');
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up for CPUT StudentHub</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="First Name"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Last Name"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
          />
        </div>
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
        <Button onClick={handleSignup}>Sign Up</Button>
      </div>
    </div>
  );
};

export default SignupScreen;
