// Core API client and configuration
export { default } from './client';
export * from './client';

// Authentication services
export * from './auth';

// Channel services (enhanced versions preferred)
export { 
  getChannels,
  getChannelsWithMemberCounts,
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  getMyChannels,
  joinChannel,
  leaveChannel,
} from './channels';

// Enhanced channel membership services
export { 
  getChannelMembers,
  checkMembership,
  getOnlineUsersInMemberships,
  getMyChannelsViaMembership,
  updateMemberRole,
} from './channelMembership';

// Messaging services
export * from './messages';

// User presence and social features
export * from './presence';
export * from './friends';

// Business logic services
export * from './products';
export * from './userProfile';
export * from './userPosts';
export * from './entrepreneur';
export * from './userProduct';