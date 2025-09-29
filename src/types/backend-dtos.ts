// Generated-by-hand DTO types aligned to backend Java DTOs (interim until OpenAPI codegen)

export type AuthResponse = {
  token: string;
  user: {
    userId: number;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userRole: string;
  };
};

export type LoginRequest = {
  userEmail: string;
  userPassword: string;
};

export type CreateChannelRequest = {
  channelName: string;
  channelType: string; // matches ChannelType enum string
  description?: string;
};

export type MessageRequest = {
  channelId: number;
  content: string;
};

export type MessageResponse = {
  id: number;
  channelId: number;
  content: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  edited?: boolean;
  editedAt?: string;
};

export type OnlineUserDto = {
  userId: number;
  name: string;
  status: string; // ONLINE/OFFLINE/BUSY/AWAY
};

export type UserStatusDto = {
  status: 'ONLINE' | 'OFFLINE' | 'BUSY' | 'AWAY';
  channelId?: number;
};

export type MembershipStatusDto = {
  isMember: boolean;
  channelId: number;
  role?: string;
};

export type ChannelMemberDto = {
  userId: number;
  name: string;
  avatarUrl?: string;
  role?: string;
  joinedAt?: string;
};

export type FriendDto = {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  status: string;
  avatarUrl?: string;
  lastSeen?: string;
  userRole?: string;
};

export type FriendRequestDto = {
  userId: number;
  fromUserId: number;
  fromUserName: string;
  fromUserEmail: string;
  fromUserAvatar?: string;
  toUserId: number;
  toUserName?: string;
  toUserEmail?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
};

export type UserSearchDto = {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  isFriend: boolean;
  requestSent: boolean;
  requestReceived?: boolean;
  avatarUrl?: string;
  status?: string;
  userRole?: string;
};

export type Channel = {
  id: number;
  name: string;
  channelType: string; // PUBLIC_FORUM | PRIVATE_GROUP | ...
  isPrivate?: boolean;
  description?: string;
  createdAt?: string;
  memberCount?: number;
};
