import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';

export interface cartFormData {
  productId: string;
  quantity: string;
}
export interface ProductsInCart {
  id: string;
  name: string;
  price: number;
  quantity: string;
  images: string[];
  bonus: string;
}

export interface cartDataResponse {
  id: string;
  products: ProductsInCart[];
  totalprice: number;
}

export interface cartState {
  cart: cartDataResponse | null;
  loading: boolean;
  status: 'loading' | 'succeeded' | 'failed';
  error: FormErrorInterface | null;
}

export const initialState: cartState = {
  cart: null,
  loading: false,
  status: 'loading',
  error: null
};

export const addToCart = createAsyncThunk(
  'cart/add',
  async (formData: cartFormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('POST', `/carts`, formData, true);

      return response.data.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse = error.response.data.message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  '/carts/product/remove',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'DELETE',
        `/carts/products/${productId}`,
        {},
        true
      );
      return response.data.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse = error.response.data.message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

export const updateCart = createAsyncThunk(
  '/carts/update',
  async (
    { cartId, formData2 }: { cartId: string; formData2: cartFormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosRequest(
        'PATCH',
        `/carts/${cartId}`,
        formData2,
        true
      );
      return response.data.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse = error.response.data.message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

export const deleteCart = createAsyncThunk(
  '/carts/delete',
  async (cartId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'DELETE',
        `/carts/${cartId}`,
        {},
        true
      );
      return response.data.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse = error.response.data.message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

export const fetchCart = createAsyncThunk('cart/get', async () => {
  try {
    const response = await axiosRequest('GET', `/carts`, '', true, true);
    return response.data.data;
  } catch (error) {
    return (error as Error).message;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addToCart.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload as unknown as cartDataResponse;
        state.loading = false;
      })
      .addCase(addToCart.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(removeFromCart.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload as unknown as cartDataResponse;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(updateCart.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload as unknown as cartDataResponse;
        state.loading = false;
      })
      .addCase(updateCart.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(deleteCart.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = null;
        state.loading = false;
      })
      .addCase(deleteCart.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload as unknown as cartDataResponse;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      });
  }
});

export default cartSlice.reducer;
