import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { createChannel } from '../../../services/api';
import Input from '../../Input';
import Button from '../../Button';

interface CreateChannelProps {
  onChannelCreated?: (channel: any) => void;
  onCancel?: () => void;
  defaultType?: 'text' | 'voice';
  compact?: boolean;
}

const CreateChannel: React.FC<CreateChannelProps> = ({
  onChannelCreated,
  onCancel,
  defaultType = 'text',
  compact = false
}) => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>(defaultType);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

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

    try {
      setError('');
      setIsLoading(true);
      const response = await createChannel(channelName.trim(), user?.id || 1);
      
      if (onChannelCreated) {
        onChannelCreated(response.data);
      }
      
      // Reset form
      setChannelName('');
      setChannelType('text');
      setIsPrivate(false);
    } catch (error) {
      setError('Failed to create channel. Please try again.');
      console.error('Channel creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateChannel();
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Create Channel</h3>
        
        {error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setChannelType('text')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                channelType === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              # Text
            </button>
            <button
              type="button"
              onClick={() => setChannelType('voice')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                channelType === 'voice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              🔊 Voice
            </button>
          </div>

          <Input
            type="text"
            placeholder={`${channelType}-channel-name`}
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            maxLength={50}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isLoading}
              className="mr-2"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-300">
              Private Channel
            </label>
          </div>

          <div className="flex space-x-2">
            {onCancel && (
              <Button
                onClick={onCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleCreateChannel}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create a Channel</h2>
        <p className="text-gray-400">
          Channels are where your community comes together to chat. Make yours and start talking.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Channel type selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Channel Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => setChannelType('text')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                channelType === 'text'
                  ? 'border-blue-500 bg-blue-50 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${channelType === 'text' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Text Channel</h3>
                  <p className="text-sm text-gray-400">Send messages, images, GIFs, emoji, opinions, and puns</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setChannelType('voice')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                channelType === 'voice'
                  ? 'border-blue-500 bg-blue-50 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${channelType === 'voice' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Voice Channel</h3>
                  <p className="text-sm text-gray-400">Hang out together with voice, video, and screen share</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Channel name */}
        <div>
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-300 mb-2">
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

        {/* Privacy setting */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isLoading}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-300 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Private Channel
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Only selected members and roles will be able to view this channel
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <Button
            onClick={onCancel}
            className="bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleCreateChannel}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Channel...' : 'Create Channel'}
        </Button>
      </div>
    </div>
  );
};

export default CreateChannel;