import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface LogInInterface {
  email: string;
  password: string;
  data?: any;
}

interface logInState {
  loading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
}

const initialState: logInState = {
  loading: false,
  error: null,
  success: false
};

export const logInUser = createAsyncThunk(
  'authentication/loginUser',
  async (userData: LogInInterface, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('POST', `/users/login`, userData);
      localStorage.setItem('token', JSON.stringify(response.data.data));
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'login failed');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

const logInSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(logInUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(logInUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default logInSlice.reducer;
