export type ChatMessage = {
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
};
