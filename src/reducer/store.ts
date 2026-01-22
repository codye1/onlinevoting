import {
  Action,
  combineReducers,
  configureStore,
  type ThunkDispatch,
} from '@reduxjs/toolkit';
import authSlice from './auth';
import { apiSlice } from './api/api.ts';
import { listenerMiddleware } from './api/listenerMiddleware';
import generalSlice from './general.tsx';
import toastsSlice from './toasts.ts';

export const rootReducer = combineReducers({
  general: generalSlice.reducer,
  toasts: toastsSlice.reducer,
  auth: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<RootState, undefined, Action>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      listenerMiddleware.middleware,
      apiSlice.middleware,
    ),
});
