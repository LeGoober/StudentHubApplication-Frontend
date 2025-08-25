import React from 'react';

interface UserAvatarProps {
  userId?: number;
  userName?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  userName,
  avatarUrl,
  size = 'md',
  showOnlineStatus = false,
  isOnline = true,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2 -bottom-0 -right-0',
    sm: 'w-2.5 h-2.5 -bottom-0 -right-0',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    xl: 'w-4 h-4 -bottom-1 -right-1'
  };

  // Generate avatar color based on user ID
  const getAvatarColor = (id?: number) => {
    if (!id) return 'bg-gray-500';
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    return colors[id % colors.length];
  };

  // Generate initials from username or use user ID
  const getInitials = () => {
    if (userName) {
      const names = userName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return userName.substring(0, 2).toUpperCase();
    }
    if (userId) {
      return `U${userId}`;
    }
    return 'U';
  };

  const avatarContent = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={userName || `User ${userId}`}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={(e) => {
        // Fallback to initials if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(userId)} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
    >
      {getInitials()}
    </div>
  );

  return (
    <div 
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      title={userName || `User #${userId}`}
    >
      {avatarContent}
      
      {/* Online status indicator */}
      {showOnlineStatus && (
        <div
          className={`absolute ${statusSizeClasses[size]} ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          } border-2 border-gray-800 rounded-full`}
        ></div>
      )}
    </div>
  );
};

export default UserAvatar;