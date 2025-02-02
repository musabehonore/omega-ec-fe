import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

interface UpdateData {
  orderId: string;
  newStatus: string;
}

export interface ProductOrderData {
  id: string;
  orderBuyer: {
    name: string;
    photoUrl: string | null;
  };
  orderedProduct: {
    images: string[];
    name: string;
    price: number;
  };
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductOrderState {
  productOrder: ProductOrderData | null;
  error: FormErrorInterface | null;
  loading: boolean;
  success: boolean;
}

const initialState: ProductOrderState = {
  productOrder: null,
  error: null,
  loading: false,
  success: false
};

export const updateProductOrderStatus = createAsyncThunk(
  'product/updateProductOrderStatus',
  async (data: UpdateData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'PUT',
        `/product-orders/${data.orderId}/status`,
        { status: data.newStatus },
        true
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: 'An error occurred' });
    }
  }
);

const updateProductOrderStatusSlice = createSlice({
  name: 'productOrderstatus',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateProductOrderStatus.pending, state => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateProductOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.productOrder = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateProductOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default updateProductOrderStatusSlice.reducer;
