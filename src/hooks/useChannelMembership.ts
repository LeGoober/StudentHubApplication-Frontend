import { useState, useEffect, useCallback } from 'react';
import { checkMembership as checkMembershipApi } from '../services/channels';
import { getMyChannels } from '../services/api';

interface UseChannelMembershipOptions {
  channelId?: number;
  userId?: number;
  autoLoad?: boolean;
}

interface UseChannelMembershipReturn {
  isMember: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkMembership: () => Promise<void>;
  refreshMembership: () => Promise<void>;
  myChannels: any[];
  loadMyChannels: () => Promise<void>;
}

export const useChannelMembership = ({
  channelId,
  autoLoad = true
}: UseChannelMembershipOptions): UseChannelMembershipReturn => {
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myChannels, setMyChannels] = useState<any[]>([]);

  const checkMembership = useCallback(async () => {
    if (!channelId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await checkMembershipApi(channelId);
      setIsMember(response.data);
    } catch (err: any) {
      console.error('Failed to check channel membership:', err);
      setError(err.response?.data?.message || 'Failed to check membership');
      setIsMember(false);
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  const loadMyChannels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyChannels();
      setMyChannels(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Failed to load my channels:', err);
      setError(err.response?.data?.message || 'Failed to load channels');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMembership = useCallback(async () => {
    await checkMembership();
    await loadMyChannels();
  }, [checkMembership, loadMyChannels]);

  useEffect(() => {
    if (autoLoad) {
      checkMembership();
      loadMyChannels();
    }
  }, [autoLoad, checkMembership, loadMyChannels]);

  return {
    isMember,
    isLoading,
    error,
    checkMembership,
    refreshMembership,
    myChannels,
    loadMyChannels
  };
};

export default useChannelMembership;
