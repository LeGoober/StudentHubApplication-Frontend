import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
}

type ProfileState = {
  profile: Profile | null;
}

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;