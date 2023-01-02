// store/store.ts

import { configureStore, Store } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { IState } from './reducer';
import userSlice from './userSlice';

const createStore = () => {
  const store = configureStore({
    reducer: {
      user: userSlice,
    },
  });
  return store;
};

const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { user: UserState }
export type AppDispatch = typeof store.dispatch;

// Other code such as selectors can use the imported `RootState` type
export const userSelector = (state: RootState) => state.user;

const wrapper = createWrapper<Store<IState>>(createStore, { debug: true });

export default wrapper;
