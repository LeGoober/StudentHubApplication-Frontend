import React, { useState } from 'react';
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
import DiscordLoader from '../components/DiscordLoader';
import ProfileModal from '../components/UserProfile/ProfileModal';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

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
  
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  
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
          <div className="bg-red-600 text-white px-4 py-2 text-sm text-center">
            {chatError} - Check your connection
          </div>
        )}
        {!isConnected && isAuthenticated && (
          <div className="bg-yellow-600 text-white px-4 py-2 text-sm text-center">
            Reconnecting to chat...
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
        <div className={`w-60 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex flex-col`}>
          <ChannelList
            activeChannelId={activeChannelId}
            onChannelSelect={handleChannelSelect}
          />
        </div>

        {/* Main chat area */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
          {/* Channel header */}
          <ChannelHeader
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

        {/* Right sidebar - Member list and user info */}
        <div className={`w-60 ${isDark ? 'bg-gray-800 border-l border-gray-700' : 'bg-gray-200 border-l border-gray-300'} p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>Online Members</h3>
            <ThemeToggle className="ml-2" />
          </div>
          <div className="space-y-2">
            {onlineUsers.slice(0, 10).map((user) => (
              <div key={user.id} className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                  {user.name?.[0] || 'U'}
                </div>
                <span className="text-sm">{user.name}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm`}>No users online</p>
            )}
          </div>
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