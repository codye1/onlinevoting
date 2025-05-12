import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import { apiSlice } from './api.ts';
import generalSlice from './general.tsx';

export const store = configureStore({
  reducer: {
    general: generalSlice.reducer,
    auth: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
