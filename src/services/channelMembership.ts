import api from './client';
import type { OkJson, ReqJson } from '../types/openapi-helpers';

// ChannelMembershipController: /channel-membership
export const getChannelMembers = async (channelId: number) => api.get<OkJson<'getChannelMembers_1'>>(`/channel-membership/${channelId}/members`);
export const checkMembership = async (channelId: number) => api.get<OkJson<'checkMembership_1'>>(`/channel-membership/check-membership/${channelId}`);
export const getOnlineUsersInMemberships = async () => api.get<OkJson<'getOnlineUsers_1'>>('/channel-membership/online-users');
export const getMyChannelsViaMembership = async () => api.get<OkJson<'getMyChannels_1'>>('/channel-membership/my-channels');
export const updateMemberRole = async (channelId: number, userId: number, role: string) =>
  api.patch<OkJson<'updateMemberRole'>>(`/channel-membership/${channelId}/members/${userId}/role`, { role } as ReqJson<'updateMemberRole'>);
