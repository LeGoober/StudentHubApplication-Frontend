import React, { useState, useEffect } from 'react';
import { updateChannel, deleteChannel, getChannel, joinChannel, leaveChannel, getChannelMembers, checkChannelMembership } from '../services/api';
import Input from './ui/Input';
import Button from './ui/Button';
import { isDefaultChannel } from '../utils/defaultChannels';
import { Channel } from '../store/slices/channelSlice';

// Using Channel interface from store/slices/channelSlice.ts

interface ChannelManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
  onChannelUpdated?: (updatedChannel: Channel) => void;
  onChannelDeleted?: (channelId: number | string) => void;
  currentUserId?: number;
  isUserMember?: boolean;
  onMembershipChanged?: () => void;
}

const ChannelManagementModal: React.FC<ChannelManagementModalProps> = ({
  isOpen,
  onClose,
  channel,
  onChannelUpdated,
  onChannelDeleted,
  currentUserId,
  isUserMember = false,
  onMembershipChanged
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'members'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  
  // Channel details state
  const [channelDetails, setChannelDetails] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && channel) {
      setEditName(channel.name || '');
      setEditDescription(channel.description || '');
      setEditCategory(channel.category || 'General');
      setEditIsPrivate(channel.isPrivate || false);
      loadChannelDetails();
    }
  }, [isOpen, channel]);

  const loadChannelDetails = async () => {
    if (!channel || isDefaultChannel(channel.id)) return;
    
    try {
      setIsLoading(true);
      const response = await getChannel(Number(channel.id));
      setChannelDetails(response.data);
      
      // Load members
      try {
        const membersResponse = await getChannelMembers(Number(channel.id));
        setMembers(membersResponse.data);
      } catch (memberErr) {
        console.warn('Failed to load channel members:', memberErr);
        setMembers([]);
      }
    } catch (err) {
      console.error('Failed to load channel details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!channel || isDefaultChannel(channel.id)) {
      setError('Default channels cannot be edited');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const updatedData = {
        channelId: Number(channel.id),
        channelName: editName?.trim() || '',
        description: editDescription?.trim() || '',
        category: editCategory || 'General',
        isPrivate: editIsPrivate
      };

      await updateChannel(Number(channel.id), updatedData);
      
      if (onChannelUpdated) {
        onChannelUpdated({
          ...channel,
          name: editName?.trim() || '',
          description: editDescription?.trim() || '',
          category: editCategory || 'General',
          isPrivate: editIsPrivate
        });
      }
      
      setSuccess('Channel updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update channel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!channel || isDefaultChannel(channel.id)) {
      setError('Default channels cannot be deleted');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete #${channel.name || 'this channel'}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      setError('');
      
      await deleteChannel(Number(channel.id));
      
      if (onChannelDeleted) {
        onChannelDeleted(channel.id);
      }
      
      onClose();
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete channel');
      setIsLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!channel || isDefaultChannel(channel.id)) return;

    try {
      setIsLoading(true);
      setError('');

      if (isUserMember) {
        await leaveChannel(Number(channel.id));
        setSuccess('Left channel successfully');
      } else {
        await joinChannel(Number(channel.id));
        setSuccess('Joined channel successfully');
      }

      if (onMembershipChanged) {
        onMembershipChanged();
      }

      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update membership');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !channel) return null;

  const isDefaultCh = isDefaultChannel(channel.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">#{channel.name || 'Unnamed Channel'}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {isDefaultCh ? 'Information Channel' : 'Channel Management'}
              </p>
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

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === 'info'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Channel Info
            </button>
            {!isDefaultCh && (
              <>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Edit Channel
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'members'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Members ({channel.memberCount || 0})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 text-green-200 rounded">
              {success}
            </div>
          )}

          {/* Channel Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About this channel</h3>
                <p className="text-gray-300">
                  {channel.description || 'No description available.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Category</h4>
                  <p className="text-white mt-1">{channel.category || 'General'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Type</h4>
                  <p className="text-white mt-1">
                    {channel.isPrivate ? '🔒 Private' : '# Public'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Members</h4>
                  <p className="text-white mt-1">{channel.memberCount || 0}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Status</h4>
                  <p className="text-white mt-1">
                    {isDefaultCh ? '📋 Default' : '👥 User Created'}
                  </p>
                </div>
              </div>

              {!isDefaultCh && (
                <div className="pt-4 border-t border-gray-700 flex justify-center">
                  <Button
                    onClick={handleJoinLeave}
                    disabled={isLoading}
                    className={`max-w-xs w-full h-12 text-lg px-6 py-3 ${
                      isUserMember 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Processing...' : (isUserMember ? 'Leave Channel' : 'Join Channel')}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && !isDefaultCh && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Edit Channel Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Channel Name</label>
                <Input
                  type="text"
                  placeholder="Enter channel name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter channel description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="General">General</option>
                  <option value="Study Groups">Study Groups</option>
                  <option value="Projects">Projects</option>
                  <option value="Social">Social</option>
                  <option value="Resources">Resources</option>
                  <option value="Information">Information</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsPrivate"
                  checked={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.checked)}
                  disabled={isLoading}
                  className="mr-2"
                />
                <label htmlFor="editIsPrivate" className="text-gray-300">
                  Private Channel (invite only)
                </label>
              </div>

              <div className="flex space-x-3 pt-4 justify-center">
                <Button
                  onClick={handleEdit}
                  disabled={isLoading || !editName?.trim()}
                  className="flex-1 h-12 text-lg px-6 py-3"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 h-12 text-lg px-6 py-3"
                >
                  {isLoading ? 'Deleting...' : 'Delete Channel'}
                </Button>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && !isDefaultCh && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Channel Members ({members.length})</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading members...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <svg className="h-12 w-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p>No members found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {members.map((member: any, index: number) => (
                    <div key={member.id || index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {(member.userFirstName?.[0] || member.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {member.userFirstName && member.userLastName 
                            ? `${member.userFirstName} ${member.userLastName}` 
                            : member.name || 'Unknown User'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {member.userEmail || member.email || 'No email available'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.userRole || 'Member'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelManagementModal;
