// store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import loginUserSlice from './loginUserSlice';

const store = configureStore({
  reducer: {
    loginUser: loginUserSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
