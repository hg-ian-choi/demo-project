// userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userId: string;
  username: string;
}

const initialState: UserState = {
  userId: '',
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId;
    },
    setUsername: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
  },
});

export const { setUserId, setUsername, setUser } = userSlice.actions;

export default userSlice.reducer;
