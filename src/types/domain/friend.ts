export type Friend = {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  status: 'online' | 'away' | 'busy' | 'invisible';
  avatar?: string;
};

export type FriendRequest = {
  id: number;
  fromUserId: number;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};
