import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import websocketService, { WebSocketMessage, ChatMessage } from '../services/websocket';
import { getMessages } from '../services/api';

interface TypingUser {
  id: number;
  name: string;
}

interface UseRealTimeChatProps {
  channelId: number;
  enabled?: boolean;
}

interface UseRealTimeChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  typingUsers: TypingUser[];
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  onlineUsers: Array<{ id: number; name: string; status: string }>;
}

export const useRealTimeChat = ({ 
  channelId, 
  enabled = true 
}: UseRealTimeChatProps): UseRealTimeChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: number; name: string; status: string }>>([]);
  
  const { user } = useSelector((state: RootState) => state.auth);

  // Load initial messages
  const loadMessages = useCallback(async (pageNum = 0, append = false) => {
    if (!enabled || !channelId) return;
    
    try {
      setIsLoading(!append);
      const response = await getMessages(channelId, pageNum);
      const newMessages = (response.data && Array.isArray(response.data.content) ? response.data.content : []) as any[];
      
      if (append) {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      } else {
        setMessages(newMessages.reverse());
      }
      
      setHasMoreMessages(newMessages.length === 50);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [channelId, enabled]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadMessages(nextPage, true);
  }, [page, hasMoreMessages, isLoading, loadMessages]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'message':
        const chatMessage: ChatMessage = {
          id: message.payload.id,
          content: message.payload.content,
          userId: message.payload.author.id,
          userName: message.payload.author.name,
          author: {
            id: message.payload.author.id,
            name: message.payload.author.name,
            avatar: message.payload.author.avatar,
            isOnline: message.payload.author.isOnline,
            userRole: message.payload.author.userRole
          },
          channelId: message.payload.channelId,
          timestamp: new Date(message.payload.timestamp),
          edited: message.payload.edited,
          replies: message.payload.replies
        };

        // Only add message if it's for current channel
        if (chatMessage.channelId === channelId) {
          setMessages(prev => {
            // Avoid duplicates
            const exists = prev.some(msg => msg.id === chatMessage.id);
            if (exists) return prev;
            return [...prev, chatMessage];
          });
        }
        break;

      case 'typing':
        if (message.payload.channelId === channelId && message.payload.userId !== user?.id) {
          setTypingUsers(prev => {
            if (message.payload.isTyping) {
              // Add user to typing list
              const exists = prev.some(u => u.id === message.payload.userId);
              if (exists) return prev;
              return [...prev, { id: message.payload.userId, name: message.payload.userName }];
            } else {
              // Remove user from typing list
              return prev.filter(u => u.id !== message.payload.userId);
            }
          });
        }
        break;

      case 'online_users':
        if (message.payload.channelId === channelId || !message.payload.channelId) {
          setOnlineUsers(message.payload.users || []);
        }
        break;

      case 'user_joined':
      case 'user_left':
        // Handle user presence updates
        setOnlineUsers(prev => {
          if (message.type === 'user_joined') {
            const exists = prev.some(u => u.id === message.payload.userId);
            if (exists) return prev;
            return [...prev, {
              id: message.payload.userId,
              name: message.payload.userName,
              status: 'online'
            }];
          } else {
            return prev.filter(u => u.id !== message.payload.userId);
          }
        });
        break;

      default:
        break;
    }
  }, [channelId, user?.id]);

  // Send message
  const sendMessage = useCallback((content: string) => {
    if (!user || !content.trim()) return;
    
    console.log('useRealTimeChat: Sending message with user:', user);
    websocketService.sendMessage(content.trim(), channelId, {
      id: user.id,
      displayName: user.displayName,
      avatar: user.avatar
    });
  }, [channelId, user]);

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (!user) return;
    
    websocketService.sendTyping(channelId, isTyping);
  }, [channelId, user]);

  // Setup WebSocket connection and message handling
  useEffect(() => {
    if (!enabled) return;

    const unsubscribeMessage = websocketService.onMessage(handleWebSocketMessage);
    const unsubscribeConnection = websocketService.onConnection(setIsConnected);

    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
    };
  }, [enabled, handleWebSocketMessage]);

  // Join/leave channel and load messages
  useEffect(() => {
    if (!enabled || !channelId || !user) return;

    // Join the channel with user information
    websocketService.joinChannel(channelId, {
      id: user.id,
      displayName: user.displayName
    });
    
    // Load initial messages
    loadMessages();
    setPage(0);

    return () => {
      // Leave the channel when component unmounts or channel changes
      websocketService.leaveChannel(channelId);
    };
  }, [channelId, enabled, loadMessages, user]);

  // Clear typing users when channel changes
  useEffect(() => {
    setTypingUsers([]);
  }, [channelId]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    typingUsers,
    sendMessage,
    sendTyping,
    loadMoreMessages,
    hasMoreMessages,
    onlineUsers
  };
};

export default useRealTimeChat;
