import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
  email: string;
  id: string;
}

interface IAuth {
  isAuth: boolean;
  authLoading: boolean;
  user: User;
}

const initialState: IAuth = {
  isAuth: false,
  authLoading: false,
  user: {
    email: '',
    id: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authUser(state, action: PayloadAction<User>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.authLoading = action.payload;
    },
  },
});

export const { authUser, setAuthLoading } = authSlice.actions;

export default authSlice;
