import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import channelReducer from './slices/channelSlice';
import profileReducer from './slices/profileSlice';
import entrepreneurReducer from './slices/entrepreneurUserProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer,
    profile: profileReducer,
    entrepreneur: entrepreneurReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;