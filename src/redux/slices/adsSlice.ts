import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest, FormErrorInterface } from '@/utils';
import axios from 'axios';

export interface ItemAttributes {
  itemId: number;
  title: string;
  sales: number;
  image: string;
  sku: {
    def: {
      price: number | null;
      promotionPrice: number;
      prices: {
        pc: number;
        app: number;
      };
    };
  };
  averageStarRate: number | null;
}

export interface DeliveryAttributes {
  freeShipping: boolean;
  shippingFee: number | null;
  shippingDisplay: string;
}

export interface AdAttributes {
  item: ItemAttributes;
  delivery: DeliveryAttributes;
}

export interface AdsState {
  adsData: AdAttributes[] | null;
  adsLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AdsState = {
  adsData: null,
  adsLoading: false,
  error: null,
  success: false
};

export const getAds = createAsyncThunk(
  'ads/getAds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('GET', '/ads');
      console.log(response.data.data);
      return response.data.data.body;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to fetch ads'
        );
      }
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAds.pending, state => {
        state.adsData = null;
        state.adsLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAds.fulfilled, (state, action) => {
        state.adsData = action.payload;
        state.adsLoading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(getAds.rejected, (state, action) => {
        state.adsData = null;
        state.adsLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  }
});

export default adsSlice.reducer;
