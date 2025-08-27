import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FriendRequest, useFriends } from '../hooks/useFriends';
import { websocketService, WebSocketMessage } from '../services/websocket';
import NotificationModal from '../components/NotificationModal';

interface NotificationContextType {
  showNotification: (friendRequest: FriendRequest) => void;
  hideNotification: () => void;
  hasUnreadNotifications: boolean;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState<FriendRequest | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<FriendRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { acceptRequest, rejectRequest, friendRequests } = useFriends();

  // Listen for WebSocket friend request notifications
  useEffect(() => {
    const handleWebSocketMessage = (message: WebSocketMessage) => {
      console.log('Received WebSocket message:', message);
      
      if (message.type === 'friend_request' && message.payload) {
        const friendRequest: FriendRequest = {
          id: message.payload.id || Date.now(),
          fromUserId: message.payload.fromUserId,
          fromUserName: message.payload.fromUserName || message.payload.senderName || 'Unknown User',
          fromUserEmail: message.payload.fromUserEmail || message.payload.senderEmail || '',
          toUserId: message.payload.toUserId,
          status: 'pending',
          createdAt: message.payload.createdAt || new Date().toISOString()
        };

        console.log('Processing friend request notification:', friendRequest);
        showNotification(friendRequest);
      }
    };

    const unsubscribe = websocketService.onMessage(handleWebSocketMessage);
    return unsubscribe;
  }, []);

  // Update unread count based on friend requests
  useEffect(() => {
    setUnreadCount(friendRequests.length);
  }, [friendRequests]);

  const showNotification = (friendRequest: FriendRequest) => {
    console.log('Showing notification for friend request:', friendRequest);
    
    // Add to queue if there's already a notification showing
    if (currentNotification) {
      setNotificationQueue(prev => [...prev, friendRequest]);
    } else {
      setCurrentNotification(friendRequest);
    }
    
    setUnreadCount(prev => prev + 1);
  };

  const hideNotification = () => {
    setCurrentNotification(null);
    
    // Show next notification from queue if any
    if (notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setNotificationQueue(prev => prev.slice(1));
      setCurrentNotification(nextNotification);
    }
  };

  const handleAcceptRequest = async (userId: number) => {
    try {
      await acceptRequest(userId);
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('Friend request accepted successfully');
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      throw error;
    }
  };

  const handleRejectRequest = async (userId: number) => {
    try {
      await rejectRequest(userId);
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('Friend request rejected successfully');
    } catch (error) {
      console.error('Failed to reject friend request:', error);
      throw error;
    }
  };

  const contextValue: NotificationContextType = {
    showNotification,
    hideNotification,
    hasUnreadNotifications: unreadCount > 0,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Modal */}
      {currentNotification && (
        <NotificationModal
          isOpen={!!currentNotification}
          onClose={hideNotification}
          friendRequest={currentNotification}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
