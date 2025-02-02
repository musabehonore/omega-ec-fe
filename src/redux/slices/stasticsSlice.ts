import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '@/utils/requests';
import axios from 'axios';

interface Stats {
  barChartData: any[];
  newProducts: number;
  expiredProducts: number;
  stockIncrement: number;
  stockReduction: number;
  productWished: number;
}

interface StatsState {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  loading: false,
  error: null
};

export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosRequest(
        'GET',
        `/stats?startDate=${startDate}&endDate=${endDate}`,
        '',
        true
      );
      console.log(response.data.data);
      return response.data.data.stats;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default statsSlice.reducer;
