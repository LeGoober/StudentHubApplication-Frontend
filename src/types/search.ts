import type { UserSearchDto, Channel } from './backend-dtos';

// Discriminated union for unified search results across users and channels
export type SearchResult =
  | { kind: 'user'; data: UserSearchDto }
  | { kind: 'channel'; data: Pick<Channel, 'id' | 'name' | 'description' | 'memberCount' | 'isPrivate'> };

// Backward-compatible alias used by useFriends search
export type SearchUser = UserSearchDto;
