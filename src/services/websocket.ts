import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from './api';
import { getAuthToken, validateToken, clearAuthData, isTokenExpired } from '../utils/jwt';

export interface WebSocketMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'typing' | 'online_users' | 'ping' | 'join_channel' | 'leave_channel' | 'friend_request';
  payload: any;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: number;
  userName: string;
  channelId: number;
  timestamp: Date;
  edited?: boolean;
  editedAt?: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  replies?: number;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private currentChannelId: number | null = null;
  private subscriptions: { [key: string]: any } = {};
  
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    const token = getAuthToken();
    
    if (!token) {
      console.log('No authentication token found. Please login first.');
      return;
    }

    if (!validateToken(token)) {
      console.error('Invalid or expired JWT token. Please login again.');
      clearAuthData();
      // Redirect to login page if needed
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/auth';
      }
      return;
    }

    console.log('Connecting STOMP client to:', `${API_URL}/ws`);
    console.log('Token validated successfully');

    // Create STOMP client with SockJS
    this.stompClient = new Client({
      brokerURL: undefined, // We'll use webSocketFactory instead
      webSocketFactory: () => {
        return new SockJS(`${API_URL}/ws?token=${encodeURIComponent(token)}`);
      },
      connectHeaders: {},
      debug: (str) => console.log('STOMP Debug:', str),
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('STOMP connected successfully:', frame);
      this.reconnectAttempts = 0;
      this.connectionHandlers.forEach(handler => handler(true));

      // Subscribe to current channel if we have one
      if (this.currentChannelId) {
        this.subscribeToChannel(this.currentChannelId);
      }

      // Subscribe to user-specific notifications
      this.subscribeToUserNotifications();
    };

    this.stompClient.onDisconnect = (receipt) => {
      console.log('STOMP disconnected:', receipt);
      this.connectionHandlers.forEach(handler => handler(false));
      this.handleReconnect();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Error details:', frame.body);
      
      // Handle authentication errors
      if (frame.headers['message'] && (
        frame.headers['message'].includes('403') || 
        frame.headers['message'].includes('Forbidden') ||
        frame.headers['message'].includes('Unauthorized')
      )) {
        console.error('WebSocket authentication failed. Token may be invalid.');
        clearAuthData();
        
        // Redirect to login page
        if (typeof window !== 'undefined' && window.location) {
          console.log('Redirecting to login due to WebSocket authentication failure');
          window.location.href = '/auth';
        }
      }
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    this.stompClient.activate();
  }

  private subscribeToChannel(channelId: number) {
    if (this.stompClient && this.stompClient.connected) {
      const topicDestination = `/topic/channel/${channelId}`;
      
      // Unsubscribe from previous channel if exists
      this.unsubscribeFromPreviousChannels();
      
      console.log('Subscribing to channel topic:', topicDestination);
      
      const subscription = this.stompClient.subscribe(topicDestination, (message: IMessage) => {
        try {
          console.log('Received STOMP message:', message.body);
          const wsMessage: WebSocketMessage = JSON.parse(message.body);
          this.messageHandlers.forEach(handler => handler(wsMessage));
        } catch (error) {
          console.error('Failed to parse STOMP message:', error);
        }
      });

      this.subscriptions[`channel-${channelId}`] = subscription;
    }
  }

  private subscribeToUserNotifications() {
    if (this.stompClient && this.stompClient.connected) {
      const userId = this.getCurrentUserId();
      if (userId) {
        const userTopicDestination = `/topic/user/${userId}`;
        console.log('Subscribing to user notifications:', userTopicDestination);
        
        const subscription = this.stompClient.subscribe(userTopicDestination, (message: IMessage) => {
          try {
            const wsMessage: WebSocketMessage = JSON.parse(message.body);
            this.messageHandlers.forEach(handler => handler(wsMessage));
          } catch (error) {
            console.error('Failed to parse user notification:', error);
          }
        });

        this.subscriptions[`user-${userId}`] = subscription;
      }
    }
  }

  private unsubscribeFromPreviousChannels() {
    Object.keys(this.subscriptions).forEach(key => {
      if (key.startsWith('channel-')) {
        console.log('Unsubscribing from:', key);
        this.subscriptions[key].unsubscribe();
        delete this.subscriptions[key];
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect STOMP WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      // Notify handlers about reconnection attempt
      this.connectionHandlers.forEach(handler => handler(false));
      
      // Exponential backoff for reconnection delay
      const backoffDelay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      setTimeout(() => {
        // Only reconnect if we still have a valid token
        const token = getAuthToken();
        if (token && validateToken(token)) {
          this.connect();
        } else {
          console.error('Cannot reconnect: Invalid or missing token');
          clearAuthData();
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = '/auth';
          }
        }
      }, Math.min(backoffDelay, 30000)); // Cap at 30 seconds
    } else {
      console.error('Max STOMP reconnection attempts reached');
      // Notify all connection handlers about permanent failure
      this.connectionHandlers.forEach(handler => handler(false));
    }
  }

  public joinChannel(channelId: number) {
    console.log('Joining channel:', channelId);
    this.currentChannelId = channelId;

    if (this.stompClient && this.stompClient.connected) {
      // Subscribe to the channel topic
      this.subscribeToChannel(channelId);

      // Send join message to the backend
      this.stompClient.publish({
        destination: '/join-channel',
        body: JSON.stringify({
          channelId: channelId,
          userId: this.getCurrentUserId(),
          userName: this.getCurrentUserName()
        })
      });

      console.log('Sent join-channel message via STOMP');
    } else {
      console.warn('STOMP client not connected, cannot join channel');
    }
  }

  public leaveChannel(channelId: number) {
    console.log('Leaving channel:', channelId);
    
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/leave-channel',
        body: JSON.stringify({
          channelId: channelId,
          userId: this.getCurrentUserId(),
          userName: this.getCurrentUserName()
        })
      });

      console.log('Sent leave-channel message via STOMP');
    }

    // Unsubscribe from channel topic
    if (this.subscriptions[`channel-${channelId}`]) {
      this.subscriptions[`channel-${channelId}`].unsubscribe();
      delete this.subscriptions[`channel-${channelId}`];
    }

    if (this.currentChannelId === channelId) {
      this.currentChannelId = null;
    }
  }

  public sendMessage(content: string, channelId: number) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/send-message',
        body: JSON.stringify({
          content: content,
          channelId: channelId,
          userId: this.getCurrentUserId(),
          userName: this.getCurrentUserName(),
          userAvatar: this.getCurrentUserAvatar(),
          timestamp: new Date().toISOString()
        })
      });

      console.log('Sent message via STOMP');
    } else {
      console.warn('STOMP client not connected, cannot send message');
    }
  }

  public sendTyping(channelId: number, isTyping: boolean) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/typing',
        body: JSON.stringify({
          channelId: channelId,
          userId: this.getCurrentUserId(),
          userName: this.getCurrentUserName(),
          isTyping: isTyping
        })
      });
    }
  }

  private getCurrentUserId(): number {
    try {
      // Try to get from Redux store via localStorage or current user data
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.userId || 0;
      }
      
      // Fallback: try to get from JWT token
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || 0;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return 0;
  }

  private getCurrentUserName(): string {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.displayName || user.username || user.name || 'Anonymous';
      }
    } catch (error) {
      console.error('Error getting user name:', error);
    }
    return 'Anonymous';
  }

  private getCurrentUserAvatar(): string {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.avatar || user.profilePicture || '';
      }
    } catch (error) {
      console.error('Error getting user avatar:', error);
    }
    return '';
  }

  // Legacy method compatibility
  public send(message: WebSocketMessage) {
    console.warn('send() method is deprecated, use specific methods like sendMessage() or joinChannel()');
    
    if (message.type === 'join_channel' && message.payload.channelId) {
      this.joinChannel(message.payload.channelId);
    } else if (message.type === 'leave_channel' && message.payload.channelId) {
      this.leaveChannel(message.payload.channelId);
    } else if (message.type === 'message' && message.payload.content && message.payload.channelId) {
      this.sendMessage(message.payload.content, message.payload.channelId);
    } else if (message.type === 'typing' && message.payload.channelId !== undefined) {
      this.sendTyping(message.payload.channelId, message.payload.isTyping);
    }
  }

  public onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  public isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  public disconnect() {
    console.log('Disconnecting STOMP client');
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.subscriptions = {};
    this.currentChannelId = null;
    this.reconnectAttempts = 0; // Reset reconnection attempts
  }

  // Method to manually reconnect when token becomes available
  public reconnectWithToken(): void {
    console.log('Attempting STOMP WebSocket reconnect with new token');
    this.disconnect();
    setTimeout(() => this.connect(), 1000); // Small delay to ensure clean disconnect
  }

  public forceReconnect() {
    console.log('Force reconnecting WebSocket...');
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  public getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' | 'error' {
    if (!this.stompClient) return 'disconnected';
    if (this.stompClient.connected) return 'connected';
    if (this.reconnectAttempts > 0 && this.reconnectAttempts < this.maxReconnectAttempts) return 'connecting';
    return 'error';
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
