import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import RightSideArea from './RightSideArea';
import DiscordLoader from './ui/DiscordLoader';
import LoginModal from './modals/LoginModal';
import SignupModal from './modals/SignupModal';
import CreateChannelModal from './CreateChannelModal';
import TopNavBar from './layout/TopNavBar';

const Main: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { token } = useSelector((state: RootState) => state.auth);
  
  // Check if user is authenticated
  const isAuthenticated = Boolean(token || localStorage.getItem('token'));

  useEffect(() => {
    // If not authenticated, show login modal
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    if (window.innerWidth < 750) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

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
    setShowCreateChannelModal(false);
    setShowProfileModal(false);
    setShowSettingsModal(false);
  };

  const handleOpenProfile = () => {
    setShowProfileModal(true);
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleChannelCreated = (channel: any) => {
    setShowCreateChannelModal(false);
    console.log('Channel created:', channel);
  };

  if (!isAuthenticated) {
    return (
      <>
        <DiscordLoader />
        
        {/* Unauthenticated view */}
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">CPUT StudentHub</h1>
            <p className="text-gray-400 mb-8">Connect with your fellow students</p>
            <div className="space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 px-6 py-2 rounded-md transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModals}
          onSwitchToSignup={handleSwitchToSignup}
        />
        <SignupModal
          isOpen={showSignupModal}
          onClose={handleCloseModals}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </>
    );
  }

  return (
    <>
      <DiscordLoader />
      
      {/* Authenticated view */}
      <div className="flex flex-col h-screen bg-gray-900">
        {/* Top Navigation */}
        <TopNavBar 
          onOpenProfile={handleOpenProfile}
          onOpenSettings={handleOpenSettings}
        />
        
        {/* Main content area */}
        <main className="flex flex-1 overflow-hidden">
          <Sidebar toggleSidebar={toggleSidebar} />
          <div className={`discord-chat-sidebar ${!isSidebarOpen && window.innerWidth < 750 ? 'hidden' : 'block'}`} id="s">
            <ChatSidebar />
          </div>
          <div className={`discord-right-area ${isSidebarOpen && window.innerWidth < 750 ? 'hidden' : 'flex'}`} id="r">
            <RightSideArea />
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        onChannelCreated={handleChannelCreated}
      />
      
      {/* Profile Modal Placeholder */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600 mb-4">Profile modal will be implemented here.</p>
            <button
              onClick={() => setShowProfileModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal Placeholder */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Settings modal will be implemented here.</p>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;