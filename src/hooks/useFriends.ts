import { useState, useEffect, useCallback } from 'react';
import { getFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, getFriendRequests, searchUsers } from '../services/api';

export type Friend = {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  status: 'online' | 'away' | 'busy' | 'invisible';
  avatar?: string;
}

export type FriendRequest = {
  id: number;
  fromUserId: number;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type SearchUser = {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  isFriend: boolean;
  requestSent: boolean;
}

type UseFriendsReturn = {
  friends: Friend[];
  friendRequests: FriendRequest[];
  loading: boolean;
  error: string | null;
  sendRequest: (userId: number) => Promise<void>;
  acceptRequest: (userId: number) => Promise<void>;
  rejectRequest: (userId: number) => Promise<void>;
  removeFriendship: (userId: number) => Promise<void>;
  searchUsers: (query: string) => Promise<SearchUser[]>;
  refreshFriends: () => Promise<void>;
  refreshRequests: () => Promise<void>;
}

export const useFriends = (): UseFriendsReturn => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasToken = () => !!localStorage.getItem('token');

  const refreshFriends = useCallback(async () => {
    // Avoid hitting protected endpoint when unauthenticated
    if (!hasToken()) {
      setFriends([]);
      setError(null);
      return;
    }
    try {
      const response = await getFriends();
      setFriends(Array.isArray(response.data) ? response.data : []);
      setError(null); // Clear error on success
    } catch (err: any) {
      console.error('Failed to fetch friends:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch friends';

      // Check for specific Hibernate errors
      if (err.message?.includes('SingleTableEntityPersister') || err.response?.data?.includes('Hibernate')) {
        setError('Backend database error. Please contact support or try again later.');
      } else {
        setError(errorMessage);
      }

      // Set empty array to prevent UI issues
      setFriends([]);
    }
  }, []);

  const refreshRequests = useCallback(async () => {
    // Avoid hitting protected endpoint when unauthenticated
    if (!hasToken()) {
      setFriendRequests([]);
      // do not set error here to keep Auth page clean
      return;
    }
    try {
      const response = await getFriendRequests();
      setFriendRequests(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Failed to fetch friend requests:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch friend requests';

      // Check for specific Hibernate errors
      if (err.message?.includes('SingleTableEntityPersister') || err.response?.data?.includes('Hibernate')) {
        setError('Backend database error. Please contact support or try again later.');
      } else {
        setError(errorMessage);
      }

      // Set empty array to prevent UI issues
      setFriendRequests([]);
    }
  }, []);

  const sendRequest = useCallback(async (userId: number) => {
    try {
      setError(null);
      await sendFriendRequest(userId);
      // Don't refresh immediately as it might not show up right away
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send friend request');
      throw err;
    }
  }, []);

  const acceptRequest = useCallback(async (userId: number) => {
    try {
      setError(null);
      await acceptFriendRequest(userId);
      await Promise.all([refreshFriends(), refreshRequests()]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept friend request');
      throw err;
    }
  }, [refreshFriends, refreshRequests]);

  const rejectRequest = useCallback(async (userId: number) => {
    try {
      setError(null);
      await rejectFriendRequest(userId);
      await refreshRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject friend request');
      throw err;
    }
  }, [refreshRequests]);

  const removeFriendship = useCallback(async (userId: number) => {
    try {
      setError(null);
      await removeFriend(userId);
      await refreshFriends();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove friend');
      throw err;
    }
  }, [refreshFriends]);

  const searchForUsers = useCallback(async (query: string): Promise<SearchUser[]> => {
    try {
      const response = await searchUsers(query);
      return Array.isArray(response.data) ? response.data : [];
    } catch (err: any) {
      console.error('Failed to search users:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (!hasToken()) {
          // If unauthenticated, skip initial fetches to avoid 403s on /auth
          setFriends([]);
          setFriendRequests([]);
          setError(null);
          return;
        }
        await Promise.all([refreshFriends(), refreshRequests()]);
      } catch (err) {
        console.error('Failed to load initial friend data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [refreshFriends, refreshRequests]);

  return {
    friends,
    friendRequests,
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriendship,
    searchUsers: searchForUsers,
    refreshFriends,
    refreshRequests
  };
};
