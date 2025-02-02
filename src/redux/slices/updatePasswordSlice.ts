import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface UpdatePasswordInterface {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdatePasswordState {
  loading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
}

const initialState: UpdatePasswordState = {
  loading: false,
  error: null,
  success: false
};

export const updatePassword = createAsyncThunk(
  'authentication/updatePassword',
  async (userData: UpdatePasswordInterface, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'POST',
        '/users/change-password',
        userData,
        true
      );
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'updating password failed');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);
const updatePasswordSlice = createSlice({
  name: 'updatePassword',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updatePassword.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default updatePasswordSlice.reducer;
