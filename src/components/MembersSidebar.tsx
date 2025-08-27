import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFriends } from '../hooks/useFriends';
import ThemeToggle from './ThemeToggle/ThemeToggle';

interface MembersSidebarProps {
  onlineUsers: Array<{ id: number; name: string; status: string }>;
  channelMembers?: Array<{ id: number; name: string; isOnline: boolean }>;
}

type TabType = 'online' | 'friends' | 'requests';

const MembersSidebar: React.FC<MembersSidebarProps> = ({ onlineUsers, channelMembers }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('online');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    friends,
    friendRequests,
    loading: friendsLoading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriendship,
    searchUsers
  } = useFriends();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await sendRequest(userId);
      // Update search results to reflect sent request
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, requestSent: true } : user
      ));
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'invisible': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'online':
        return (
          <div className="space-y-2">
            {onlineUsers.slice(0, 10).map((user) => (
              <div key={user.id} className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} p-2 rounded cursor-pointer`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-sm font-semibold relative`}>
                  {user.name?.[0] || 'U'}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'}`}></div>
                </div>
                <span className="text-sm flex-1">{user.name}</span>
                <button
                  onClick={() => setShowAddFriend(true)}
                  className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Add
                </button>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm`}>No users online</p>
            )}
          </div>
        );
        
      case 'friends':
        return (
          <div className="space-y-2">
            {friendsLoading ? (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm`}>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm`}>No friends yet</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} p-2 rounded`}>
                  <div className={`w-8 h-8 ${isDark ? 'bg-green-500' : 'bg-green-600'} rounded-full flex items-center justify-center text-white text-sm font-semibold relative`}>
                    {friend.name?.[0] || 'U'}
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'}`}></div>
                  </div>
                  <span className="text-sm flex-1">{friend.name}</span>
                  <button
                    onClick={() => removeFriendship(friend.id)}
                    className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        );
        
      case 'requests':
        return (
          <div className="space-y-2">
            {friendRequests.filter(req => req.status === 'pending').length === 0 ? (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm`}>No pending requests</p>
            ) : (
              friendRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className={`flex flex-col space-y-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 ${isDark ? 'bg-yellow-500' : 'bg-yellow-600'} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {request.fromUserName?.[0] || 'U'}
                    </div>
                    <span className="text-sm flex-1">{request.fromUserName}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => acceptRequest(request.fromUserId)}
                      className={`flex-1 text-xs px-2 py-1 rounded ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(request.fromUserId)}
                      className={`flex-1 text-xs px-2 py-1 rounded ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`w-60 ${isDark ? 'bg-gray-800 border-l border-gray-700' : 'bg-gray-200 border-l border-gray-300'} p-4`}>
      {/* Header with theme toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>Members</h3>
        <ThemeToggle className="ml-2" />
      </div>

      {/* Tab navigation */}
      <div className="flex space-x-1 mb-4">
        {[
          { key: 'online' as TabType, label: 'Online', count: onlineUsers.length },
          { key: 'friends' as TabType, label: 'Friends', count: friends.length },
          { key: 'requests' as TabType, label: 'Requests', count: friendRequests.filter(req => req.status === 'pending').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-xs px-2 py-1 rounded relative ${
              activeTab === tab.key
                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center ${
                activeTab === tab.key ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add friend button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddFriend(true)}
          className={`w-full text-sm px-3 py-2 rounded ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          + Add Friend
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-xs">
          {error}
        </div>
      )}

      {/* Tab content */}
      {renderTabContent()}

      {/* Add friend modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96 max-w-full mx-4`}>
            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-4`}>Add Friend</h3>
            
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className={`w-full p-2 border rounded mb-4 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />

            <div className="max-h-60 overflow-y-auto mb-4">
              {searchLoading ? (
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Searching...</p>
              ) : searchResults.length === 0 && searchQuery ? (
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No users found</p>
              ) : (
                searchResults.map((user) => (
                  <div key={user.id} className={`flex items-center justify-between p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                        {user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{user.name}</p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{user.email}</p>
                      </div>
                    </div>
                    {user.isFriend ? (
                      <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>Friend</span>
                    ) : user.requestSent ? (
                      <span className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Sent</span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowAddFriend(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className={`flex-1 px-4 py-2 rounded ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-sm`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersSidebar;
