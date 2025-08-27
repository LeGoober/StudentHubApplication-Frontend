import React, { useState, useEffect } from 'react';
import { getChannelMembers, getChannel } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface ChannelInfo {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  isPrivate?: boolean;
  createdAt?: string;
  createdBy?: string;
}

interface ChannelMember {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  role?: string;
}

interface ChannelInfoModalProps {
  channelId: number;
  channelName: string;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const ChannelInfoModal: React.FC<ChannelInfoModalProps> = ({
  channelId,
  channelName,
  isOpen,
  onClose,
  position
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');

  useEffect(() => {
    if (isOpen && channelId) {
      loadChannelData();
    }
  }, [isOpen, channelId]);

  const loadChannelData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load channel details and members in parallel
      const [channelResponse, membersResponse] = await Promise.all([
        getChannel(channelId).catch(() => ({ data: null })),
        getChannelMembers(channelId).catch(() => ({ data: [] }))
      ]);

      if (channelResponse.data) {
        setChannelInfo({
          id: channelId,
          name: channelResponse.data.name || channelName,
          description: channelResponse.data.description,
          memberCount: channelResponse.data.memberCount || 0,
          isPrivate: channelResponse.data.isPrivate,
          createdAt: channelResponse.data.createdAt,
          createdBy: channelResponse.data.createdBy
        });
      } else {
        // Fallback if channel details aren't available
        setChannelInfo({
          id: channelId,
          name: channelName,
          memberCount: 0
        });
      }

      setMembers(membersResponse.data || []);
    } catch (err: any) {
      console.error('Failed to load channel data:', err);
      setError('Failed to load channel information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getOnlineCount = () => members.filter(m => m.isOnline).length;

  if (!isOpen) return null;

  const modalStyle = position ? {
    position: 'fixed' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000
  } : {};

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        style={modalStyle}
        className={`${
          isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        } border rounded-lg shadow-xl p-4 w-80 max-w-sm z-50 ${
          position ? '' : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold truncate`}>
            #{channelInfo?.name || channelName}
          </h2>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} text-xl font-bold`}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-8`}>
            Loading channel information...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-3 py-2 text-sm rounded ${
                  activeTab === 'info'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Info
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 px-3 py-2 text-sm rounded relative ${
                  activeTab === 'members'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Members
                {members.length > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                    activeTab === 'members' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                  }`}>
                    {members.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            {activeTab === 'info' ? (
              <div className="space-y-3">
                {channelInfo?.description && (
                  <div>
                    <h4 className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-1`}>
                      Description
                    </h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {channelInfo.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-1`}>
                      Members
                    </h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {channelInfo?.memberCount || members.length}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-1`}>
                      Online
                    </h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {getOnlineCount()}
                    </p>
                  </div>
                </div>

                {channelInfo?.createdAt && (
                  <div>
                    <h4 className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-1`}>
                      Created
                    </h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {formatDate(channelInfo.createdAt)}
                    </p>
                    {channelInfo.createdBy && (
                      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs mt-0.5`}>
                        by {channelInfo.createdBy}
                      </p>
                    )}
                  </div>
                )}

                {channelInfo?.isPrivate && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded flex items-center space-x-2`}>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                      Private Channel
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {members.length === 0 ? (
                  <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm text-center py-4`}>
                    No members found
                  </p>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center space-x-3 p-2 rounded ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-8 h-8 ${
                            member.isOnline 
                              ? isDark ? 'bg-green-600' : 'bg-green-500'
                              : isDark ? 'bg-gray-600' : 'bg-gray-400'
                          } rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                            {member.name?.[0] || 'U'}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                            member.isOnline ? 'bg-green-400' : 'bg-gray-400'
                          } rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium truncate`}>
                            {member.name}
                          </p>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs truncate`}>
                            {member.role || (member.isOnline ? 'Online' : 'Offline')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ChannelInfoModal;
