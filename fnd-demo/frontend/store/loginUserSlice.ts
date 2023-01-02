// store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface LoginUserState {
  username: string;
}

const initialState: LoginUserState = {
  username: '',
};

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginUserState>) => {
      state.username = action.payload.username;
    },
  },
});

export const { setUser } = loginUserSlice.actions;

export const loginUserSelector = (state: RootState) => state.loginUser;

export default loginUserSlice.reducer;
