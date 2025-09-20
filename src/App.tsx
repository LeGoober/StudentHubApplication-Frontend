import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './screens/AuthScreen';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';
import EntrepreneurProductsScreen from './screens/EntrepreneurProductsScreen';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/channels" replace /> : 
              <Navigate to="/auth" replace />
            } 
          />
          <Route 
            path="/channels" 
            element={
              isAuthenticated ? 
              <ChannelScreen /> : 
              <Navigate to="/auth" replace />
            } 
          />
          <Route 
            path="/profile/:id" 
            element={
              isAuthenticated ? 
              <ProfileScreen /> : 
              <Navigate to="/auth" replace />
            } 
          />
          <Route
            path="/entrepreneur/products"
            element={
              isAuthenticated ?
                <EntrepreneurProductsScreen /> :
                <Navigate to="/auth" replace />
            }
          />
          <Route path="*" element={<div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">404 - Page Not Found</div>} />
        </Routes>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
