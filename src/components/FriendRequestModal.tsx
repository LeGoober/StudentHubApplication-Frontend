import React, { useState, useEffect } from 'react';
import { useFriends, FriendRequest } from '../hooks/useFriends';
import UserAvatar from './features/User/UserAvatar';

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendRequestModal: React.FC<FriendRequestModalProps> = ({ isOpen, onClose }) => {
  const { friendRequests, acceptRequest, rejectRequest, loading } = useFriends();
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'received' | 'outgoing'>('received');

  useEffect(() => {
    if (isOpen) {
      // Clear any processing states when modal opens
      setProcessingRequests(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAcceptRequest = async (userId: number) => {
    setProcessingRequests(prev => new Set(prev).add(userId));
    try {
      await acceptRequest(userId);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (userId: number) => {
    setProcessingRequests(prev => new Set(prev).add(userId));
    try {
      await rejectRequest(userId);
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const receivedRequests = friendRequests.filter(req => req.status === 'pending');
  const outgoingRequests = friendRequests.filter(req => req.status === 'accepted' || req.status === 'rejected');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Friend Requests</h2>
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
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'received'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'outgoing'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            History ({outgoingRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <>
              {/* Received Requests */}
              {activeTab === 'received' && (
                <div className="space-y-3">
                  {receivedRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p>No pending friend requests</p>
                    </div>
                  ) : (
                    receivedRequests.map((request) => (
                      <div key={request.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserAvatar 
                            userName={request.fromUserName} 
                            avatarUrl="" 
                            size="sm" 
                            showOnlineStatus={true}
                            isOnline={false}
                          />
                          <div>
                            <h3 className="text-white font-medium">{request.fromUserName}</h3>
                            <p className="text-gray-400 text-sm">{request.fromUserEmail}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request.fromUserId)}
                            disabled={processingRequests.has(request.fromUserId)}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
                          >
                            {processingRequests.has(request.fromUserId) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Accept</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.fromUserId)}
                            disabled={processingRequests.has(request.fromUserId)}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
                          >
                            {processingRequests.has(request.fromUserId) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* History */}
              {activeTab === 'outgoing' && (
                <div className="space-y-3">
                  {outgoingRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p>No request history</p>
                    </div>
                  ) : (
                    outgoingRequests.map((request) => (
                      <div key={request.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserAvatar 
                            userName={request.fromUserName} 
                            avatarUrl="" 
                            size="sm" 
                            showOnlineStatus={true}
                            isOnline={false}
                          />
                          <div>
                            <h3 className="text-white font-medium">{request.fromUserName}</h3>
                            <p className="text-gray-400 text-sm">{request.fromUserEmail}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm flex items-center space-x-1 ${
                            request.status === 'accepted' ? 'text-green-400' : 
                            request.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {request.status === 'accepted' ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : request.status === 'rejected' ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            <span className="capitalize">{request.status}</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestModal;
