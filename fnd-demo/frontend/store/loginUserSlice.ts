// store/counterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define a type for the slice state
interface LoginUser {
  loginUserId: string;
  loginUsername: string;
}

// Define the initial state using that type
const initialState: LoginUser = {
  loginUserId: '',
  loginUsername: '',
};

export const loginUserSlice = createSlice({
  name: 'loginUser',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoginUserId: (state, action: PayloadAction<LoginUser>) => {
      state.loginUserId = action.payload.loginUserId;
    },
    setLoginUsername: (state, action: PayloadAction<LoginUser>) => {
      state.loginUsername = action.payload.loginUsername;
    },
    setLoginUser: (state, action: PayloadAction<LoginUser>) => {
      state.loginUserId = action.payload.loginUserId;
      state.loginUsername = action.payload.loginUsername;
    },
  },
});

export const { setLoginUserId, setLoginUsername, setLoginUser } = loginUserSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const loginUserSelector = (state: RootState) => state.loginUser;

export default loginUserSlice.reducer;
