import React, { useState } from 'react';
import UserAvatar from '../User/UserAvatar';
import MessageContent from './MessageContent';

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
      isOnline?: boolean;
    };
    timestamp: Date;
    edited?: boolean;
    replies?: number;
  };
  isOwn?: boolean;
  showAvatar?: boolean;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn = false,
  showAvatar = true,
  onReply,
  onEdit,
  onDelete,
  onReact
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (days === 1) {
      return 'Yesterday ' + timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (days < 7) {
      return timestamp.toLocaleDateString('en-US', { weekday: 'long' }) + ' ' +
             timestamp.toLocaleTimeString('en-US', { 
               hour: '2-digit', 
               minute: '2-digit',
               hour12: false 
             });
    } else {
      return timestamp.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
  };

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div
      className={`group flex items-start space-x-3 p-3 hover:bg-gray-700 transition-colors ${
        isOwn ? 'bg-gray-800' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          <UserAvatar 
            userId={message.author.id} 
            size="md" 
            showOnlineStatus 
          />
        </div>
      )}

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header with author and timestamp */}
        {showAvatar && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-white">
              {message.author.name || `User #${message.author.id}`}
            </span>
            <span className="text-xs text-gray-400">
              {formatTimestamp(message.timestamp)}
              {message.edited && (
                <span className="ml-1 text-gray-500">(edited)</span>
              )}
            </span>
          </div>
        )}

        {/* Message text with markdown support */}
        <MessageContent content={message.content} enableMarkdown={true} />

        {/* Reply count */}
        {message.replies && message.replies > 0 && (
          <button
            onClick={() => onReply?.(message.id)}
            className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {message.replies} {message.replies === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* React button */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Add reaction"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Reaction picker */}
            {showReactions && (
              <div className="absolute bottom-8 right-0 bg-gray-800 border border-gray-600 rounded-lg p-2 flex space-x-1 z-10">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply button */}
          {onReply && (
            <button
              onClick={() => onReply(message.id)}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Reply"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
          )}

          {/* Edit button (only for own messages) */}
          {isOwn && onEdit && (
            <button
              onClick={() => onEdit(message.id)}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Edit"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {/* Delete button (only for own messages) */}
          {isOwn && onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1 rounded hover:bg-gray-600 transition-colors text-red-400 hover:text-red-300"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;