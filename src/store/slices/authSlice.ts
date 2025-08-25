import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  status: string;
  userRole: string;
  createdAt: string;
  lastSeen: string;
  online: boolean;
  // Optional legacy fields for backwards compatibility
  firstName?: string;
  lastName?: string;
  role?: string;
  studentNumber?: string;
  staffNumber?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;