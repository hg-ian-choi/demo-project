// store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface LoginUserState {
  userId: string;
  username: string;
  wallet: string;
}

const initialState: LoginUserState = {
  userId: '',
  username: '',
  wallet: '',
};

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<LoginUserState>) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.wallet = action.payload.wallet;
    },
  },
});

export const { setLoginUser } = loginUserSlice.actions;

export const loginUserSelector = (state: RootState) => state.loginUser;

export default loginUserSlice.reducer;
