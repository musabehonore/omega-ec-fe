import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface ProfileData {
  address: string;
  birthdate: string | null;
  createdAt: string;
  email: string;
  gender: string | null;
  googleId: string | null;
  id: string;
  lastTimePasswordUpdated: string;
  name: string;
  phone: string;
  photoUrl: string | null;
  preferedcurrency: string | null;
  preferedlanguage: string | null;
  status: boolean;
  updatedAt: string;
  verified: boolean;
}

export interface ProfileResponse {
  status: string;
  data: ProfileData;
  message: string;
}

export interface ProfileState {
  loading: boolean;
  profile: ProfileResponse | null;
  status: 'loading' | 'succeeded' | 'failed';
  error: FormErrorInterface | null;
}

export const initialState: ProfileState = {
  loading: false,
  profile: null,
  status: 'loading',
  error: null
};

export interface ProfileFormData {
  name?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  preferedcurrency?: string;
  preferedlanguage?: string;
  gender?: string;
  address?: string;
  image?: File;
}

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    try {
      const response = await axiosRequest('GET', `/users/profile`, '', true);
      // console.log('RESPONSE: ', response.data);
      return response.data;
    } catch (error) {
      return (error as Error).message;
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData2: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'PATCH',
        `/users/profile`,
        formData2,
        true
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse =
        error.response.data.data[0].message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload as unknown as ProfileResponse;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(updateProfile.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload as unknown as ProfileResponse;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      });
  }
});

export default profileSlice.reducer;
