import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { createChannel } from '../services/api';
import { logDiagnostics } from '../utils/apiDiagnostics';
import Input from './ui/Input';
import Button from './ui/Button';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated?: (channel: any) => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ 
  isOpen, 
  onClose, 
  onChannelCreated 
}) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    if (!channelName.trim()) {
      setError('Channel name is required');
      return false;
    }

    if (channelName.length < 3) {
      setError('Channel name must be at least 3 characters long');
      return false;
    }

    if (channelName.length > 50) {
      setError('Channel name must be less than 50 characters');
      return false;
    }

    // Check for valid channel name characters
    const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNamePattern.test(channelName)) {
      setError('Channel name can only contain letters, numbers, spaces, hyphens, and underscores');
      return false;
    }

    return true;
  };

  const handleCreateChannel = async () => {
    if (!validateForm()) return;

    // Check authentication
    if (!token) {
      setError('You must be logged in to create a channel.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      
      const requestData = {
        channelNameField: channelName.trim(),
        channelTypeField: channelType.toUpperCase(), 
        description: channelDescription.trim() || undefined
      };
      
      console.log('Creating channel with data:', requestData);
      console.log('User token present:', !!token);
      console.log('User data:', user);
      
      const response = await createChannel(
        channelName.trim(), 
        channelType.toUpperCase(),
        channelDescription.trim() || undefined
      );
      
      console.log('Channel creation response:', response);
      
      if (onChannelCreated) {
        onChannelCreated(response.data);
      }
      
      onClose();
      setChannelName('');
      setChannelDescription('');
      setChannelType('text');
      setIsPrivate(false);
    } catch (error: any) {
      console.error('Channel creation failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = 'Failed to create channel. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      
      // Run diagnostics to help debug the issue
      console.log('Running API diagnostics due to channel creation failure...');
      logDiagnostics();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateChannel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Channel</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="channelType" className="block text-sm font-medium text-gray-700 mb-2">
                Channel Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannelType('text')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    channelType === 'text'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Text</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setChannelType('voice')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    channelType === 'voice'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Voice</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <Input
                id="channelName"
                type="text"
                placeholder={`${channelType}-channel-name`}
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {channelName.length}/50 characters
              </p>
            </div>

            <div>
              <label htmlFor="channelDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="channelDescription"
                placeholder="What's this channel about?"
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                disabled={isLoading}
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {channelDescription.length}/200 characters
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={isLoading}
                className="mr-2"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                Private Channel (invite only)
              </label>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChannel}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Channel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;