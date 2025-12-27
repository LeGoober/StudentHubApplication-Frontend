import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import AuthScreen from './screens/AuthScreen';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';
import EntrepreneurProductsScreen from './screens/EntrepreneurProductsScreen';
import EntrepreneurUserProfileScreen from './screens/EntrepreneurUserProfileScreen';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/auth" element={<AuthScreen />} />
            <Route
              path="/"
              element={<Navigate to="/channels" replace />}
            />
            <Route
              path="/channels"
              element={<ErrorBoundary><ChannelScreen /></ErrorBoundary>}
            />
            <Route
              path="/profile/:id"
              element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>}
            />
            <Route
              path="/entrepreneur/products"
              element={<ErrorBoundary><EntrepreneurProductsScreen /></ErrorBoundary>}
            />
            <Route
              path="/entrepreneur-products"
              element={<ErrorBoundary><EntrepreneurProductsScreen /></ErrorBoundary>}
            />
            <Route
              path="/entrepreneurs/:userId"
              element={<ErrorBoundary><EntrepreneurUserProfileScreen /></ErrorBoundary>}
            />
            <Route
              path="/entrepreneurs/:userId/products"
              element={<ErrorBoundary><EntrepreneurProductsScreen /></ErrorBoundary>}
            />
            <Route path="*" element={<div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">404 - Page Not Found</div>} />
          </Routes>
        </ErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
