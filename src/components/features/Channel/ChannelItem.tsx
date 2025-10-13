import React, { useState } from 'react';
import { Channel } from '../../../store/slices/channelSlice';

interface ChannelItemProps {
  channel: Channel;
  isActive?: boolean;
  onClick?: (channelId: number | string) => void;
  onEdit?: (channelId: number | string) => void;
  onDelete?: (channelId: number | string) => void;
  onMute?: (channelId: number | string) => void;
  onManage?: (channel: Channel) => void;
  showActions?: boolean;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  onMute,
  onManage,
  showActions = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(channel.id);
    }
  };

  const getChannelIcon = () => {
    if (channel.type === 'voice') {
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      );
    }

    if (channel.isPrivate) {
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <span className="text-gray-400 font-bold">#</span>
    );
  };

  const getTextColorClass = () => {
    if (isActive) return 'text-white';
    if (channel.unreadCount && channel.unreadCount > 0) return 'text-white';
    return 'text-gray-400';
  };

  const getBgColorClass = () => {
    if (isActive) return 'bg-gray-600';
    if (isHovered) return 'bg-gray-700';
    return '';
  };

  return (
    <div
      className={`group relative flex items-center px-2 py-1.5 rounded mx-2 cursor-pointer transition-all ${getBgColorClass()}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Channel icon */}
      <div className={`flex-shrink-0 mr-2 ${getTextColorClass()}`}>
        {getChannelIcon()}
      </div>

      {/* Channel name */}
      <span className={`flex-1 text-sm font-medium truncate ${getTextColorClass()}`}>
        {channel.name}
      </span>

      {/* Member count for all channels */}
      {channel.memberCount !== undefined && channel.memberCount > 0 && (
        <span className="text-xs text-gray-400 mr-2 flex items-center">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          {channel.memberCount}
        </span>
      )}

      {/* Unread indicator */}
      {channel.unreadCount && channel.unreadCount > 0 && (
        <div className="flex-shrink-0 ml-2">
          <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
          </div>
        </div>
      )}

      {/* Notification dot */}
      {channel.hasNotification && !channel.unreadCount && (
        <div className="flex-shrink-0 ml-2">
          <div className="bg-red-500 w-2 h-2 rounded-full"></div>
        </div>
      )}

      {/* Actions menu */}
      {showActions && (isHovered || showMenu) && (
        <div className="flex-shrink-0 ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-gray-600 transition-colors"
          >
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 py-1 min-w-[150px]">
              {onManage ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onManage(channel);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {channel.isDefault ? 'Channel Info' : 'Manage Channel'}
                  </div>
                </button>
              ) : (
                <>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(channel.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Edit Channel
                    </button>
                  )}
                  
                  {onMute && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMute(channel.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Mute Channel
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(channel.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                    >
                      Delete Channel
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelItem;