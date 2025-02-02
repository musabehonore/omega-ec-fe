import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface UserInterface {
  email: string;
}

interface forgotpasswordState {
  loading: boolean;
  resError: FormErrorInterface | null;
  success: boolean;
}

const initialState: forgotpasswordState = {
  loading: false,
  resError: null,
  success: false
};

export const forgotpassword = createAsyncThunk(
  'authentication/forgotpassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = { email };
      console.log('email', email);
      const response = await axiosRequest(
        'POST',
        `/users/forgot-password`,
        data
      );
      localStorage.setItem('token', JSON.stringify(response.data));

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'forgot password failed');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

const ForgotpasswordSlice = createSlice({
  name: 'forgot',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(forgotpassword.pending, state => {
        state.loading = true;
        state.resError = null;
        state.success = false;
      })
      .addCase(forgotpassword.fulfilled, state => {
        state.loading = false;
        state.resError = null;
        state.success = true;
      })
      .addCase(forgotpassword.rejected, (state, action) => {
        state.loading = false;
        state.resError = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default ForgotpasswordSlice.reducer;
