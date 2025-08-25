import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import UserStatus, { StatusType } from './UserStatus';

interface UserCardProps {
  user: {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
    status?: StatusType;
    joinDate?: Date;
    isOnline?: boolean;
    customStatus?: string;
  };
  onSendMessage?: (userId: number) => void;
  onViewProfile?: (userId: number) => void;
  onMention?: (userId: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onSendMessage,
  onViewProfile,
  onMention,
  showActions = true,
  compact = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatJoinDate = (date?: Date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + 
                        (now.getMonth() - date.getMonth());
    
    if (diffInMonths === 0) {
      return 'This month';
    } else if (diffInMonths === 1) {
      return '1 month ago';
    } else if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    } else {
      const years = Math.floor(diffInMonths / 12);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  };

  const displayName = user.name || `User #${user.id}`;
  const status = user.status || (user.isOnline ? 'online' : 'offline');

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={() => onViewProfile?.(user.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <UserAvatar
          userId={user.id}
          userName={user.name}
          avatarUrl={user.avatar}
          size="sm"
          showOnlineStatus
          isOnline={user.isOnline}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{displayName}</p>
          {user.customStatus && (
            <p className="text-xs text-gray-400 truncate">{user.customStatus}</p>
          )}
        </div>
        <UserStatus status={status} size="sm" />
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <UserAvatar
            userId={user.id}
            userName={user.name}
            avatarUrl={user.avatar}
            size="lg"
            showOnlineStatus
            isOnline={user.isOnline}
            onClick={() => onViewProfile?.(user.id)}
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{displayName}</h3>
            {user.email && (
              <p className="text-sm text-gray-400">{user.email}</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <UserStatus status={status} size="sm" showLabel />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        {showActions && isHovered && (
          <div className="flex space-x-1">
            {onSendMessage && (
              <button
                onClick={() => onSendMessage(user.id)}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                title="Send message"
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            )}
            {onMention && (
              <button
                onClick={() => onMention(user.id)}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
                title="Mention user"
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom status */}
      {user.customStatus && (
        <div className="mb-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-300">{user.customStatus}</p>
          </div>
        </div>
      )}

      {/* User info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">User ID:</span>
          <span className="text-gray-300">{user.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Joined:</span>
          <span className="text-gray-300">{formatJoinDate(user.joinDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <UserStatus status={status} size="sm" showLabel />
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 mt-4">
          {onViewProfile && (
            <button
              onClick={() => onViewProfile(user.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              View Profile
            </button>
          )}
          {onSendMessage && (
            <button
              onClick={() => onSendMessage(user.id)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Message
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;