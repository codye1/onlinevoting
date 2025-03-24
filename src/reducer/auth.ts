import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
}

interface IAuth {
  isAuth: boolean;
  count: number;
  user: User;
}

const initialState: IAuth = {
  isAuth: false,
  count: 0,
  user: {
    id: '',
    email: '',
  },
};

const authSlice = createSlice({
  name: 'searchActive',
  initialState,
  reducers: {
    authUser(state, action: PayloadAction<User>) {
      state.isAuth = true;
      state.user = action.payload;
    },
  },
});

export const { authUser } = authSlice.actions;

export default authSlice;
