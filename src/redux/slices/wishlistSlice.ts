import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';
import { ProductInterface } from './ProductSlice';

export interface wishedDataResponse {
  count: number;
  rows: ProductInterface[];
}

export interface wishlistFormData {
  productId: string;
}
export interface wishedDataResponse2 {
  count: number;
  rows: Row[];
}

export interface Row {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  expiryDate?: Date;
  bonus?: string;
  status: boolean;
  quantity: number;
  description: string;
  averageRatings: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  expired: boolean;
}

export interface WishlistState {
  wishlist2: wishedDataResponse2 | null;
  wishlist: wishedDataResponse | null;
  loading: boolean;
  status: 'loading' | 'succeeded' | 'failed';
  error: FormErrorInterface | null;
}

export const initialState: WishlistState = {
  wishlist2: null,
  wishlist: null,
  loading: false,
  status: 'loading',
  error: null
};

export const addWishlist = createAsyncThunk(
  'wishlist/add',
  async (formData: wishlistFormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('POST', `/wishes`, formData, true);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
      }
      const error = err as any;
      const errorResponse = error.response.data.message || error.response.data;
      return rejectWithValue({ message: errorResponse });
    }
  }
);

export const fetchWishes = createAsyncThunk('wishlist/get', async () => {
  try {
    const response = await axiosRequest('GET', `/wishes`, '', true, true);
    return response.data.data.wishlist;
  } catch (error) {
    return (error as Error).message;
  }
});

export function isWishedDataResponse2(data: any): data is wishedDataResponse2 {
  if (
    typeof data !== 'object' ||
    data === null ||
    !Array.isArray(data.rows) ||
    !data.rows.every(
      (row: any) =>
        typeof row === 'object' &&
        'id' in row &&
        'userId' in row &&
        'productId' in row &&
        'createdAt' in row &&
        'updatedAt' in row &&
        'product' in row &&
        typeof row.product === 'object' &&
        'id' in row.product &&
        'name' in row.product &&
        'slug' in row.product &&
        Array.isArray(row.product.images) &&
        'price' in row.product &&
        'expiryDate' in row.product &&
        'bonus' in row.product &&
        'status' in row.product &&
        'quantity' in row.product &&
        'description' in row.product &&
        'averageRatings' in row.product &&
        'reviewsCount' in row.product &&
        'createdAt' in row.product &&
        'updatedAt' in row.product &&
        'expired' in row.product
    )
  ) {
    return false;
  }
  return true;
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addWishlist.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(addWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.message === 'Product added to wishlist') {
          if (!state.wishlist) {
            state.wishlist = { count: 0, rows: [] };
          }
          state.wishlist.count += 1;
          state.wishlist?.rows.push(action.payload.data.product);
        } else if (
          action.payload.message === 'Wishlist item deleted successfully'
        ) {
          if (state.wishlist && state.wishlist.count > 0) {
            state.wishlist.count -= 1;
            state.wishlist!.rows = state.wishlist!.rows.filter(
              product => product.id !== action.payload.data.product.id
            );
          } else {
            state.wishlist = null;
          }
        }
        state.loading = false;
      })
      .addCase(addWishlist.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      })
      .addCase(fetchWishes.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchWishes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (isWishedDataResponse2(action.payload)) {
          state.wishlist2 = action.payload;
        } else {
          state.wishlist = action.payload as unknown as wishedDataResponse;
        }
        state.loading = false;
      })
      .addCase(fetchWishes.rejected, state => {
        state.status = 'failed';
        state.loading = false;
      });
  }
});

export default wishlistSlice.reducer;
