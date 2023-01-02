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
    setLoginUser: (state, action: PayloadAction<LoginUserState>) => {
      state.username = action.payload.username;
    },
  },
});

export const { setLoginUser } = loginUserSlice.actions;

export const loginUserSelector = (state: RootState) => state.loginUser;

export default loginUserSlice.reducer;
