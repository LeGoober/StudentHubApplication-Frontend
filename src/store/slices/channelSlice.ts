import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChannelState {
  channels: any[];
}

const initialState: ChannelState = {
  channels: [],
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setChannels(state, action: PayloadAction<any[]>) {
      state.channels = action.payload;
    },
  },
});

export const { setChannels } = channelSlice.actions;
export default channelSlice.reducer;