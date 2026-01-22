import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from './store';

type toastTypes = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: toastTypes;
  duration: number;
}

const initialState: Toast[] = [];

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Toast>) {
      state.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      return state.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastsSlice.actions;

export const addToastWithTimeout =
  (toast: Toast) => (dispatch: AppDispatch) => {
    dispatch(addToast(toast));

    setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);
  };

export default toastsSlice;
