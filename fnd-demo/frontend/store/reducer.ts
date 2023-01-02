// store/reducer.ts

import { AnyAction, CombinedState, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import userReducer, { UserState } from './userSlice';

export interface IState {
  user: UserState;
}

const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user: userReducer,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
