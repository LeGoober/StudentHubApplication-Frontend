import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { useRealTimeChat } from '../hooks/useRealTimeChat';
import TopNavBar from '../components/layout/TopNavBar';
import ChannelHeader from '../components/layout/ChannelHeader';
import StatusBar from '../components/layout/StatusBar';
import ChannelList from '../components/features/Channel/ChannelList';
import MessageList from '../components/features/Chat/MessageList';
import ChatInput from '../components/features/Chat/ChatInput';
import DiscordLoader from '../components/ui/DiscordLoader';
import ProfileModal from '../components/UserProfile/ProfileModal';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import MembersSidebar from '../components/MembersSidebar';

interface Message {
  id: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  timestamp: Date;
  edited?: boolean;
  replies?: number;
}

const ChannelScreen: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState<number | string>('default-1'); // Default to welcome-home channel
  const [activeChannelName, setActiveChannelName] = useState('welcome-home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  // Responsive behavior: auto-collapse sidebars on small screens
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      
      if (isMobile) {
        // On mobile, collapse both sidebars by default
        setLeftSidebarCollapsed(true);
        setRightSidebarCollapsed(true);
      } else if (isTablet) {
        // On tablet, collapse right sidebar by default
        setRightSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts for sidebar toggling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + [ to toggle left sidebar
      if (e.ctrlKey && e.key === '[') {
        e.preventDefault();
        setLeftSidebarCollapsed(prev => !prev);
      }
      // Ctrl + ] to toggle right sidebar  
      if (e.ctrlKey && e.key === ']') {
        e.preventDefault();
        setRightSidebarCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Use real-time chat hook
  const {
    messages,
    isConnected,
    isLoading: chatLoading,
    error: chatError,
    typingUsers,
    sendMessage: sendRealTimeMessage,
    sendTyping,
    onlineUsers
  } = useRealTimeChat({
    channelId: typeof activeChannelId === 'string' ? parseInt(activeChannelId.replace('default-', '')) || 1 : activeChannelId,
    enabled: Boolean(token || localStorage.getItem('token'))
  });
  
  // Check if user is authenticated
  const isAuthenticated = Boolean(token || localStorage.getItem('token'));

  const handleChannelSelect = (channelId: number | string) => {
    setActiveChannelId(channelId);
    // Handle both default channels and regular channels
    if (typeof channelId === 'string' && channelId.startsWith('default-')) {
      const channelMap: Record<string, string> = {
        'default-1': 'welcome-home',
        'default-2': 'how-to-navigate', 
        'default-3': 'channel-settings',
        'default-4': 'about-studenthub'
      };
      setActiveChannelName(channelMap[channelId] || `channel-${channelId}`);
    } else {
      setActiveChannelName(`channel-${channelId}`);
    }
  };

  const handleSendMessage = (content: string) => {
    sendRealTimeMessage(content);
  };

  const handleMessageReply = (messageId: string) => {
    console.log('Reply to message:', messageId);
  };

  const handleMessageEdit = (messageId: string) => {
    console.log('Edit message:', messageId);
  };

  const handleMessageDelete = (messageId: string) => {
    console.log('Delete message:', messageId);
    // Could implement actual delete via API
  };

  const handleMessageReact = (messageId: string, emoji: string) => {
    console.log('React to message:', messageId, 'with:', emoji);
  };

  const handleOpenProfile = () => {
    setShowProfileModal(true);
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  // ChannelScreen now assumes user is authenticated (routing handles this)

  const isDark = theme === 'dark';
  
  return (
    <>
      <DiscordLoader />
      <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Connection status indicator */}
        {chatError && (
          <div className="bg-red-600 text-white px-4 py-2 text-sm text-center flex items-center justify-between">
            <span>{chatError} - Check your connection</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-xs"
            >
              Reload
            </button>
          </div>
        )}
        {!isConnected && isAuthenticated && !chatError && (
          <div className="bg-yellow-600 text-white px-4 py-2 text-sm text-center flex items-center justify-between">
            <span>Reconnecting to chat...</span>
            <button 
              onClick={() => {
                const websocketService = require('../services/websocket').default;
                websocketService.forceReconnect();
              }}
              className="ml-2 px-2 py-1 bg-yellow-700 hover:bg-yellow-800 rounded text-xs"
            >
              Retry Now
            </button>
          </div>
        )}
        
        {/* Top Navigation Bar */}
        <TopNavBar 
          onOpenProfile={handleOpenProfile}
          onOpenSettings={handleOpenSettings}
          onChannelSelect={handleChannelSelect}
          onUserSelect={(userId) => {
            console.log('User selected:', userId);
            // Could open user profile modal or start DM
          }}
        />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Channel list */}
        <div className={`${leftSidebarCollapsed ? 'w-12 md:w-12' : 'w-60 md:w-60'} ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex flex-col transition-all duration-300 ease-in-out relative flex-shrink-0`}>
          {/* Left sidebar toggle button */}
          <button
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className={`absolute ${leftSidebarCollapsed ? '-right-3' : 'right-2'} bottom-20 z-10 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} rounded-full p-1.5 transition-all duration-200 shadow-md`}
            title={leftSidebarCollapsed ? 'Expand Channels (Ctrl+[)' : 'Collapse Channels (Ctrl+[)'}
          >
            <svg 
              className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-transform duration-200 ${leftSidebarCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {!leftSidebarCollapsed ? (
            <ChannelList
              activeChannelId={activeChannelId}
              onChannelSelect={handleChannelSelect}
            />
          ) : (
            <div className="flex flex-col items-center pt-16 space-y-2">
              {/* Active channel indicator */}
              <div className={`w-8 h-8 ${isDark ? 'bg-blue-600' : 'bg-blue-500'} rounded flex items-center justify-center`}>
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              {/* Channel count indicator */}
              <div className={`w-8 h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded flex items-center justify-center`}>
                <svg className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Main chat area */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-600' : 'bg-white'} relative`}>
          {/* Channel header */}
          <ChannelHeader
            channelId={typeof activeChannelId === 'string' ? parseInt(activeChannelId.replace('default-', '')) || undefined : activeChannelId}
            channelName={activeChannelName}
            memberCount={onlineUsers.length}
            description="General discussion for CPUT students"
          />

          {/* Messages */}
          <MessageList
            messages={messages}
            onReply={handleMessageReply}
            onEdit={handleMessageEdit}
            onDelete={handleMessageDelete}
            onReact={handleMessageReact}
            loading={chatLoading}
          />

          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className={`px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          {/* Chat input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            channelName={activeChannelName}
          />
        </div>

        {/* Right sidebar - Enhanced Member list */}
        <div className={`${rightSidebarCollapsed ? 'w-12 md:w-12' : 'w-64 md:w-64'} ${isDark ? 'bg-gray-800' : 'bg-gray-200'} transition-all duration-300 ease-in-out relative flex flex-col flex-shrink-0`}>
          {/* Right sidebar toggle button */}
          <button
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            className={`absolute ${rightSidebarCollapsed ? '-left-3' : 'left-2'} bottom-20 z-10 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} rounded-full p-1.5 transition-all duration-200 shadow-md`}
            title={rightSidebarCollapsed ? 'Expand Members (Ctrl+])' : 'Collapse Members (Ctrl+])'}
          >
            <svg 
              className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-transform duration-200 ${rightSidebarCollapsed ? '' : 'rotate-180'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {!rightSidebarCollapsed ? (
            <MembersSidebar 
              onlineUsers={onlineUsers}
            />
          ) : (
            <div className="flex flex-col items-center pt-16 space-y-2">
              <div className={`w-8 h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded flex items-center justify-center`}>
                <svg className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} rotate-90 mt-4`}>
                {onlineUsers.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <StatusBar
        onlineCount={45}
        serverStatus="online"
        lastActivity={new Date()}
      />

      {/* Enhanced Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isOwnProfile={true}
      />

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Settings modal content here.</p>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ChannelScreen;