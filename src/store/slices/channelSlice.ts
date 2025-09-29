import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

type ChannelState = {
  channels: Channel[];
}

const initialState: ChannelState = {
  channels: [],
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setChannels(state, action: PayloadAction<Channel[]>) {
      state.channels = action.payload;
    },
  },
});

export const { setChannels } = channelSlice.actions;
export default channelSlice.reducer;