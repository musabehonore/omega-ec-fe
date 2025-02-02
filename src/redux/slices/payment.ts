import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PaymentState {
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null
};

export const checkoutNow = createAsyncThunk(
  'payment/checkoutNow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')?.replaceAll('"', '')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Payment failed');
      }
      const data = await response.json();
      window.location.href = data.Success_url;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(checkoutNow.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutNow.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkoutNow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default paymentSlice.reducer;
