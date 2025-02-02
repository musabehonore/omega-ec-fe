import { FormErrorInterface, axiosInstance, axiosRequest } from '@/utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

export interface Product {
  name: string;
  price: string;
  quantity: string;
  description: string;
  categoryId?: string;
  expiryDate?: string;
  images?: File[];
}

export interface ReviewerInterface {
  name: string;
  email: string;
  photoUrl: string | null;
  repliedBy: string | null;
  replies: string;
}

export interface ReplyInterface {
  rating: number;
  text: ReactNode;
  id: string;
  repliedBy: ReviewerInterface;
  reviewedBy: string;
  replies: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddReviewInterface {
  productId: string;
  rating: number;
  feedback: string;
}

export interface AddReplyInterface {
  reviewId: string;
  feedback: string;
}

export interface ReviewInterface extends AddReviewInterface {
  repliedBy: any;
  id: string;
  reviewedBy: ReviewerInterface;
  repliesCount: number;
  replies: ReplyInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  product: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  reviews: ReviewInterface[];
  replies: ReplyInterface[];
  loadingReviews: boolean;
  loadingReplies: boolean;
}

const initialState: ProductState = {
  product: null,
  status: 'idle',
  error: null,
  reviews: [],
  replies: [],
  loadingReviews: false,
  loadingReplies: false
};

export const addProduct = createAsyncThunk<Product, Product>(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        if (key === 'images' && product.images) {
          product.images.forEach(image => formData.append('images', image));
        } else {
          formData.append(key, product[key as keyof Product] as string);
        }
      });

      const response = await axiosRequest('POST', '/products', formData, true);

      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getReviews = createAsyncThunk(
  'products/getReview',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/reviews?productId=${productId}`
      );

      return response.data.data.allReviews as ReviewInterface[];
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addReview = createAsyncThunk(
  'products/addReview',
  async (review: AddReviewInterface, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('POST', '/reviews', review, true);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const addReply = createAsyncThunk(
  'products/addReply',
  async (replyData: AddReplyInterface, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'POST',
        `/reviews/${replyData.reviewId}/replies`,
        {
          feedback: replyData.feedback
        },
        true
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getReply = createAsyncThunk(
  'products/getReply',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'GET',
        `/reviews/${reviewId}/replies`,
        true
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addProduct.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getReviews.pending, state => {
        state.loadingReviews = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loadingReviews = false;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.reviews = [];
        state.loadingReviews = false;
        state.error = (action.payload as FormErrorInterface).message;
      })
      .addCase(addReview.pending, state => {
        state.loadingReviews = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loadingReviews = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loadingReviews = false;
        state.status = 'failed';
        state.error = (action.payload as FormErrorInterface).message;
      })
      .addCase(addReply.pending, state => {
        state.loadingReviews = true;
        state.error = null;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.loadingReviews = false;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addReply.rejected, (state, action) => {
        state.loadingReviews = false;
        state.error = (action.payload as FormErrorInterface).message;
        state.status = 'failed';
      })
      .addCase(getReply.pending, state => {
        state.replies = [];
        state.loadingReplies = true;
        state.error = null;
      })
      .addCase(getReply.fulfilled, (state, action) => {
        state.replies = action.payload;
        state.loadingReplies = false;
        state.error = null;
      })
      .addCase(getReply.rejected, (state, action) => {
        state.loadingReplies = false;
        state.replies = [];
        state.error = (action.payload as FormErrorInterface).message;
      });
  }
});

export default productSlice.reducer;
