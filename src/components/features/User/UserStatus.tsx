import React from 'react';

export type StatusType = 'online' | 'away' | 'busy' | 'invisible' | 'offline';

interface UserStatusProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const UserStatus: React.FC<UserStatusProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
      icon: '●'
    },
    away: {
      color: 'bg-yellow-500',
      label: 'Away',
      icon: '○'
    },
    busy: {
      color: 'bg-red-500',
      label: 'Busy',
      icon: '⊘'
    },
    invisible: {
      color: 'bg-gray-500',
      label: 'Invisible',
      icon: '○'
    },
    offline: {
      color: 'bg-gray-400',
      label: 'Offline',
      icon: '○'
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2 text-xs',
    md: 'w-3 h-3 text-sm',
    lg: 'w-4 h-4 text-base'
  };

  const config = statusConfig[status];

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`${sizeClasses[size]} ${config.color} rounded-full flex-shrink-0`}
          title={config.label}
        ></div>
        <span className="text-sm text-gray-300 capitalize">
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${config.color} rounded-full ${className}`}
      title={config.label}
    ></div>
  );
};

export default UserStatus;