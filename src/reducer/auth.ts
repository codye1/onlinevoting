import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
  email: string;
  id: string;
}

interface IAuth {
  isAuth: boolean;
  user: User;
}

const initialState: IAuth = {
  isAuth: false,
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
    logoutUser(state) {
      state.isAuth = false;
      state.user = { email: '', id: '' };
    },
  },
});

export const { authUser, logoutUser } = authSlice.actions;

export default authSlice;
