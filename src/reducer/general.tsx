import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IGeneral {
  buttonLoading: boolean;
}

const initialState: IGeneral = {
  buttonLoading: false,
};

const generalSlice = createSlice({
  name: 'searchActive',
  initialState,
  reducers: {
    setButtonLoading(state, action: PayloadAction<boolean>) {
      state.buttonLoading = action.payload;
    },
  },
});

export const { setButtonLoading } = generalSlice.actions;

export default generalSlice;
