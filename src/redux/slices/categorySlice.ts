import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface CategoryAttributes {
  id: string;
  name: string;
  description: string;
}

interface CategoriesState {
  categoriesData: CategoryAttributes[] | null;
  categoriesLoading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
}

const initialState: CategoriesState = {
  categoriesData: null,
  categoriesLoading: false,
  error: null,
  success: false
};

export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    console.log('fetching categories');
    try {
      const response = await axiosRequest('GET', `/categories`);
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

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCategories.pending, state => {
        state.categoriesData = null;
        state.categoriesLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesData = action.payload;
        state.categoriesLoading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesData = null;
        state.categoriesLoading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default categoriesSlice.reducer;
