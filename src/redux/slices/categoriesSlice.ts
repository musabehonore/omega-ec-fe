import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '@/utils';
import axios from 'axios';

export interface Category {
  name: string;
  id: string;
}

export interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: 'idle',
  error: null
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('GET', '/categories', '', true);
      console.log('Categories fetched successfully:', response.data.data);
      return response.data.data as Category[];
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 401) {
          console.log('Unauthorized! Please check your authentication token.');
        } else {
          console.error('An unexpected error occurred:', err);
        }
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default categoriesSlice.reducer;
