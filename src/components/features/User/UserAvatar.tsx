import React from 'react';
import { getUserInitials } from '../../../utils/userDisplay';

interface UserAvatarProps {
  userId?: number;
  userName?: string;
  avatarUrl?: string;
  userRole?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  showEntrepreneurBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  userName,
  avatarUrl,
  userRole,
  size = 'md',
  showOnlineStatus = false,
  isOnline = true,
  showEntrepreneurBadge = false,
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

  const starBadgeSizeClasses = {
    xs: 'w-3 h-3 -top-0.5 -right-0.5 text-xs',
    sm: 'w-3.5 h-3.5 -top-0.5 -right-0.5 text-xs',
    md: 'w-4 h-4 -top-1 -right-1 text-sm',
    lg: 'w-5 h-5 -top-1 -right-1 text-base',
    xl: 'w-6 h-6 -top-1.5 -right-1.5 text-lg'
  };

  // Check if user is entrepreneur
  const isEntrepreneur = userRole === 'ENTREPRENEUR' || (showEntrepreneurBadge && userRole?.toUpperCase() === 'ENTREPRENEUR');

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

  // Generate initials using utility function
  const getInitials = () => {
    return getUserInitials({ id: userId, displayName: userName });
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
          } border-2 border-gray-800 rounded-full z-10`}
        ></div>
      )}

      {/* Entrepreneur star badge */}
      {isEntrepreneur && (
        <div
          className={`absolute ${starBadgeSizeClasses[size]} bg-yellow-500 border-2 border-gray-800 rounded-full flex items-center justify-center z-20`}
          title="Entrepreneur"
        >
          <svg className="text-white fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;