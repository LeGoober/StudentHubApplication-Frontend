import React, { useState } from 'react';
import { FriendRequest } from '../hooks/useFriends';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendRequest: FriendRequest;
  onAccept: (userId: number) => Promise<void>;
  onReject: (userId: number) => Promise<void>;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  friendRequest,
  onAccept,
  onReject
}) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);

  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      setLoading(true);
      setAction('accept');
      await onAccept(friendRequest.fromUserId);
      onClose();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setAction('reject');
      await onReject(friendRequest.fromUserId);
      onClose();
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#36393f] rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2f3136]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Friend Request</h3>
              <p className="text-sm text-[#b9bbbe]">New notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#b9bbbe] hover:text-white transition-colors p-1"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#404449] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#b9bbbe]">
                {friendRequest.fromUserName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              {friendRequest.fromUserName}
            </h4>
            <p className="text-[#b9bbbe] mb-1">
              {friendRequest.fromUserEmail}
            </p>
            <p className="text-sm text-[#72767d]">
              wants to be your friend
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 bg-[#3ba55c] hover:bg-[#2d7d32] disabled:bg-[#2d7d32]/50 text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {loading && action === 'accept' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>Accept</span>
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-[#ed4245] hover:bg-[#c62d31] disabled:bg-[#c62d31]/50 text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {loading && action === 'reject' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>Decline</span>
            </button>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full mt-3 text-[#b9bbbe] hover:text-white transition-colors py-2 text-sm font-medium"
          >
            Decide Later
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4">
          <div className="text-xs text-[#72767d] text-center">
            Received {new Date(friendRequest.createdAt).toLocaleDateString()} at{' '}
            {new Date(friendRequest.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
