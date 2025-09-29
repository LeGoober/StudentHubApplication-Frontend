export type Channel = {
  id: number | string;
  name: string;
  type?: 'text' | 'voice';
  isPrivate?: boolean;
  unreadCount?: number;
  hasNotification?: boolean;
  memberCount?: number;
  category?: string;
  description?: string;
  isDefault?: boolean;
};
