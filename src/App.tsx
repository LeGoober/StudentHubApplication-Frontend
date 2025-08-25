import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/channels" replace />} />
        <Route path="/channels" element={<ChannelScreen />} />
        <Route path="/profile/:id" element={<ProfileScreen />} />
        <Route path="*" element={<div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">404 - Page Not Found</div>} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
