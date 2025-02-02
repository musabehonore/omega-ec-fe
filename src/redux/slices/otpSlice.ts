import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';
import { DecodedInterface, USER_ROLE } from './userSlice';
import { jwtDecode } from 'jwt-decode';

interface OtpState {
  loading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
  token: string | null;
  userToken: string | null;
  userRole: USER_ROLE | null;
}

const initialState: OtpState = {
  loading: false,
  error: null,
  success: false,
  token: null,
  userToken: null,
  userRole: null
};

export interface VerifyOtpResponse {
  data: string;
}

export const verifyOtp = createAsyncThunk(
  'authentication/verifyOtp',
  async (
    { otp, token }: { otp: string; token: string | '' },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosRequest('POST', `/users/verify/${token}`, {
        otp
      });

      return response.data as unknown as VerifyOtpResponse;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'Verification failed');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    setUserToken(state, action: PayloadAction<string | null>) {
      state.userToken = action.payload;
    },
    clearUserToken(state) {
      state.userToken = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.token = null;
        state.userRole = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.token = action.payload.data;
        state.userRole = (
          jwtDecode(action.payload.data) as DecodedInterface
        ).role;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
        state.token = null;
        state.userRole = null;
      });
  }
});

export const { setUserToken, clearUserToken } = otpSlice.actions;
export default otpSlice.reducer;
