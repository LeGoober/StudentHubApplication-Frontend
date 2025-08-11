import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/channels" element={<ChannelScreen />} />
      <Route path="/profile/:id" element={<ProfileScreen />} />
      <Route path="*" element={<div className="flex items-center justify-center h-screen bg-gray-100">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default App;
