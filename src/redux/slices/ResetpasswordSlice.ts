import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface UserInterface {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordState {
  loading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
}

const initialState: ResetPasswordState = {
  loading: false,
  error: null,
  success: false
};

export const resetpassword = createAsyncThunk(
  'authentication/resetpassword',
  async ({ password, confirmPassword }: UserInterface, { rejectWithValue }) => {
    try {
      const userdata = { password, confirmPassword };
      const token = JSON.parse(localStorage.getItem('token') || '');
      const token2 = token.data;
      const response = await axiosRequest(
        'PATCH',
        `/users/reset-password/${token2}`,
        userdata
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'Reset password failed');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

const ResetpasswordSlice = createSlice({
  name: 'reset',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetpassword.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(resetpassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(resetpassword.rejected, state => {
        state.loading = false;
        state.error = null;
        state.success = false;
      });
  }
});

export default ResetpasswordSlice.reducer;
