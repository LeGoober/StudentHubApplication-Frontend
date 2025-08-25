import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getChannels, joinChannel } from '../services/api';
import Button from './Button';

interface Channel {
  id: number;
  name: string;
  description?: string;
  category?: string;
  memberCount?: number;
  isPrivate?: boolean;
  isJoined?: boolean;
}

interface DiscoverChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelJoined?: (channel: Channel) => void;
}

const DiscoverChannelsModal: React.FC<DiscoverChannelsModalProps> = ({
  isOpen,
  onClose,
  onChannelJoined
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [joiningChannels, setJoiningChannels] = useState<Set<number>>(new Set());

  const { token } = useSelector((state: RootState) => state.auth);
  const currentChannels = useSelector((state: RootState) => state.channel.channels);

  useEffect(() => {
    if (isOpen && token) {
      loadAllChannels();
    }
  }, [isOpen, token]);

  useEffect(() => {
    filterChannels();
  }, [channels, searchTerm, selectedCategory]);

  const loadAllChannels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getChannels();
      
      // Mark which channels user has already joined
      const channelsWithJoinStatus = response.data.map((channel: any) => ({
        id: channel.id,
        name: channel.name || channel.channelName,
        description: channel.description || '',
        category: channel.category || 'General',
        memberCount: channel.memberCount || Math.floor(Math.random() * 50) + 1, // Mock data
        isPrivate: channel.isPrivate || false,
        isJoined: currentChannels.some(c => c.id === channel.id)
      }));

      setChannels(channelsWithJoinStatus);
    } catch (err) {
      console.error('Failed to load channels:', err);
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const filterChannels = () => {
    let filtered = channels.filter(channel => !channel.isPrivate); // Only show public channels

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(term) ||
        (channel.description && channel.description.toLowerCase().includes(term)) ||
        (channel.category && channel.category.toLowerCase().includes(term))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(channel => channel.category === selectedCategory);
    }

    setFilteredChannels(filtered);
  };

  const handleJoinChannel = async (channel: Channel) => {
    if (joiningChannels.has(channel.id)) return;

    try {
      setJoiningChannels(prev => new Set(prev).add(channel.id));
      await joinChannel(channel.id);
      
      // Update channel status
      const updatedChannels = channels.map(c =>
        c.id === channel.id ? { ...c, isJoined: true, memberCount: (c.memberCount || 0) + 1 } : c
      );
      setChannels(updatedChannels);

      if (onChannelJoined) {
        onChannelJoined({ ...channel, isJoined: true });
      }

    } catch (err: any) {
      console.error('Failed to join channel:', err);
      setError(err.response?.data?.message || 'Failed to join channel');
    } finally {
      setJoiningChannels(prev => {
        const newSet = new Set(prev);
        newSet.delete(channel.id);
        return newSet;
      });
    }
  };

  const categories = ['All', ...Array.from(new Set(channels.map(c => c.category).filter(Boolean)))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Discover Channels</h2>
              <p className="text-gray-400 text-sm mt-1">Find and join public channels</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading channels...</p>
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">No channels found</p>
              <p className="text-gray-500">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredChannels.map(channel => (
                <div
                  key={channel.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-lg font-bold mr-2">#</span>
                      <h3 className="text-white font-semibold truncate">{channel.name}</h3>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                      {channel.category}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {channel.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      {channel.memberCount} members
                    </div>

                    {channel.isJoined ? (
                      <div className="flex items-center text-green-400 text-sm">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Joined
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleJoinChannel(channel)}
                        disabled={joiningChannels.has(channel.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-1 text-sm"
                      >
                        {joiningChannels.has(channel.id) ? 'Joining...' : 'Join'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''} found
            </p>
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverChannelsModal;
