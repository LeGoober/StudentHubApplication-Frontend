import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { getChannels } from '../../../services/api';
import ChannelItem from './ChannelItem';
import CreateChannelModal from '../../CreateChannelModal';

interface Channel {
  id: number;
  name: string;
  type?: 'text' | 'voice';
  isPrivate?: boolean;
  unreadCount?: number;
  hasNotification?: boolean;
  memberCount?: number;
  category?: string;
}

interface ChannelListProps {
  activeChannelId?: number;
  onChannelSelect?: (channelId: number) => void;
  onChannelEdit?: (channelId: number) => void;
  onChannelDelete?: (channelId: number) => void;
  onChannelMute?: (channelId: number) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  activeChannelId,
  onChannelSelect,
  onChannelEdit,
  onChannelDelete,
  onChannelMute
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Load channels on component mount
  useEffect(() => {
    if (token) {
      loadChannels();
    }
  }, [token]);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getChannels();
      
      // Transform API response to match our interface
      const transformedChannels = response.data.map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        type: 'text' as const,
        isPrivate: false,
        unreadCount: Math.floor(Math.random() * 5), // Mock unread count
        hasNotification: Math.random() > 0.7,
        memberCount: Math.floor(Math.random() * 50) + 1,
        category: channel.category || 'General'
      }));
      
      setChannels(transformedChannels);
    } catch (error) {
      console.error('Failed to load channels:', error);
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelCreated = (newChannel: any) => {
    const transformedChannel: Channel = {
      id: newChannel.id,
      name: newChannel.name,
      type: 'text',
      isPrivate: false,
      unreadCount: 0,
      hasNotification: false,
      memberCount: 1,
      category: 'General'
    };
    
    setChannels(prev => [...prev, transformedChannel]);
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Group channels by category
  const groupedChannels = channels.reduce((acc, channel) => {
    const category = channel.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  // Sort categories (General first, then alphabetically)
  const sortedCategories = Object.keys(groupedChannels).sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-700 h-8 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-400 mb-2">{error}</div>
        <button
          onClick={loadChannels}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with create button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Channels
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 rounded hover:bg-gray-700 transition-colors"
          title="Create Channel"
        >
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Channel categories and channels */}
      <div className="py-2">
        {sortedCategories.map(category => {
          const categoryChannels = groupedChannels[category];
          const isCollapsed = collapsedCategories.has(category);
          const textChannels = categoryChannels.filter(ch => ch.type !== 'voice');
          const voiceChannels = categoryChannels.filter(ch => ch.type === 'voice');

          return (
            <div key={category} className="mb-4">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-1 hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {category}
                </span>
                <svg
                  className={`h-3 w-3 text-gray-400 transform transition-transform ${
                    isCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Channels in category */}
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {/* Text channels */}
                  {textChannels.map(channel => (
                    <ChannelItem
                      key={`text-${channel.id}`}
                      channel={channel}
                      isActive={channel.id === activeChannelId}
                      onClick={onChannelSelect}
                      onEdit={onChannelEdit}
                      onDelete={onChannelDelete}
                      onMute={onChannelMute}
                    />
                  ))}

                  {/* Voice channels */}
                  {voiceChannels.length > 0 && textChannels.length > 0 && (
                    <div className="px-4 py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>
                  )}
                  
                  {voiceChannels.map(channel => (
                    <ChannelItem
                      key={`voice-${channel.id}`}
                      channel={channel}
                      isActive={channel.id === activeChannelId}
                      onClick={onChannelSelect}
                      onEdit={onChannelEdit}
                      onDelete={onChannelDelete}
                      onMute={onChannelMute}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {channels.length === 0 && (
          <div className="px-4 py-8 text-center">
            <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-gray-400 text-sm mb-2">No channels yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Create your first channel
            </button>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChannelCreated={handleChannelCreated}
      />
    </div>
  );
};

export default ChannelList;