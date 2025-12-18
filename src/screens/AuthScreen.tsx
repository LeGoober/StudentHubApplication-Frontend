import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import LoginModal from '../components/modals/LoginModal';
import SignupModal from '../components/modals/SignupModal';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const AuthScreen: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = Boolean(token || localStorage.getItem('token'));

  // Redirect to channels if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/channels');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handleLoginSuccess = () => {
    console.log('handleLoginSuccess called, navigating to /channels');
    handleCloseModals();
    navigate('/channels');
  };

  const handleSignupSuccess = () => {
    handleCloseModals();
    navigate('/channels');
  };

  const isDark = theme === 'dark';

  return (
    <>

      {/* Main Auth Screen */}
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center max-w-md mx-auto px-6">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {/* Logo and Branding */}
          <div className="mb-12">
            <div className={`mx-auto w-24 h-24 ${isDark ? 'bg-blue-600' : 'bg-blue-700'} rounded-full flex items-center justify-center mb-6`}>
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CPUT StudentHub
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Connect with your fellow students
            </p>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mb-8`}>
              Join channels, chat, and collaborate on projects
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In to Your Account
            </button>

            <button
              onClick={() => setShowSignupModal(true)}
              className={`w-full border-2 font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Features */}
          <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="text-center">
              <div className={`w-12 h-12 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Connect</p>
              <p className="text-xs">Chat with students</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-sm font-medium">Collaborate</p>
              <p className="text-xs">Work on projects</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm font-medium">Learn</p>
              <p className="text-xs">Share knowledge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onSwitchToSignup={handleSwitchToSignup}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default AuthScreen;
