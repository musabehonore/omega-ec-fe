import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';
import _ from 'lodash';

interface SellerState {
  loadingSellers: boolean;
  error: FormErrorInterface | null;
  success: boolean;
  data: SellerInterface[] | null;
}

const initialState: SellerState = {
  loadingSellers: false,
  error: null,
  success: false,
  data: null
};

export interface SellerInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const getSellers = createAsyncThunk(
  'user/sellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('GET', `/users/sellers`);
      return response.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'Failed to fetch products');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

const SellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSellers.pending, state => {
        state.loadingSellers = true;
        state.data = null;
        state.error = null;
        state.success = false;
      })
      .addCase(getSellers.fulfilled, (state, action) => {
        state.loadingSellers = false;
        state.data = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(getSellers.rejected, (state, action) => {
        state.loadingSellers = false;
        state.data = null;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default SellerSlice.reducer;
