import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, FormErrorInterface } from '@/utils';
import { CategoryAttributes } from './categorySlice';
import { ReactNode } from 'react';
import { ReviewInterface } from './itemSlice';

interface sellerInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProductInterface {
  description: ReactNode;
  id: string;
  name: string;
  slug: string;
  images: string[];
  categoryId: string;
  category?: CategoryAttributes;
  price: number;
  expiryDate: Date;
  bonus: string;
  status: boolean;
  quantity: number;
  sellerId: string;
  seller?: sellerInterface;
  averageRatings?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  expired: boolean;
}

export interface ProductDataInterface {
  totalItems: number;
  products: ProductInterface[];
  totalPages: number;
  from: number;
  to: number;
}

export interface SellerInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProductDetailsInterface {
  bonus: string;
  status: string;
  price: string;
  quantity: string;
  description: string;
  categoryId: null;
  expiryDate: string;
  images: never[];
  name: string;
  product: ProductInterface;
  relatedProducts: ProductInterface[];
  sellerInfo: SellerInterface;
}

interface ProductState {
  Grouped: {
    [key: string]: {
      data: ProductInterface[] | null;
      error: FormErrorInterface | null;
      loading: boolean;
    };
  };
  reviews: any;
  data: ProductDataInterface | null;
  selectedProduct: ProductDetailsInterface | null;
  loading: boolean;
  error: FormErrorInterface | null;
  success: boolean;
  showSideNav: boolean;
  message: String;
}
export interface ReviewAttributes {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  feedback: string;
  repliesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsResponse {
  data: ProductDataInterface;
}

interface OrderBy {
  bonus: string;
}

export interface ProductQueryInterface {
  name?: string;
  limit?: string;
  page?: number;
  sellerId?: string;
  categoryId?: string;
  priceLessThan?: number;
  priceGreaterThan?: number;
  section?: string;
  orderBy?: OrderBy;
}

const initialState: ProductState = {
  Grouped: {},
  data: null,
  selectedProduct: null,
  loading: false,
  error: null,
  success: false,
  showSideNav: true,
  message: '',
  reviews: undefined
};

export const getProductDetails = createAsyncThunk(
  'products/getDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest('GET', `/products/${productId}`);
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
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'DELETE',
        `/products/${productId}`,
        {},
        true
      );
      return response.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'Failed to delete product');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getProducts = createAsyncThunk(
  'products/search',
  async (productQuery: ProductQueryInterface, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (productQuery.name) queryParams.append('name', productQuery.name);
      if (productQuery.limit)
        queryParams.append('limit', productQuery.limit.toString());
      if (productQuery.page)
        queryParams.append('page', productQuery.page.toString());
      if (productQuery.sellerId)
        queryParams.append('sellerId', productQuery.sellerId);
      if (productQuery.categoryId)
        queryParams.append('categoryId', productQuery.categoryId);
      if (productQuery.priceLessThan)
        queryParams.append(
          'priceLessThan',
          productQuery.priceLessThan.toString()
        );
      if (productQuery.priceGreaterThan)
        queryParams.append(
          'priceGreaterThan',
          productQuery.priceGreaterThan.toString()
        );

      const url = `/products?${queryParams.toString()}`;

      const response = await axiosRequest<null, ProductsResponse>(
        'GET',
        url,
        null,
        true
      );

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
export const getAverage = (reviews: ReviewInterface[]): number => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }

  const totalRatings = reviews.reduce((acc, rev) => acc + rev.rating, 0);
  return totalRatings / reviews.length;
};

export const getProductsByCategory = createAsyncThunk(
  'products/getByCategory',
  async (query: ProductQueryInterface, { rejectWithValue }) => {
    try {
      const Url =
        query.section == 'bonus'
          ? `/products?sort=bonus:asc&limit=10`
          : `/products?categoryId=${query.categoryId}&limit=12`;
      const response = await axiosRequest('GET', Url);

      return { section: query.section, products: response.data.data.products };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data || 'Failed to fetch products');
      }
      const error = err as Error;
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateStatus',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest(
        'PATCH',
        `/products/${productId}/status`,
        {},
        true
      );
      return response.data.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(
          err.response.data || 'Failed to update product status'
        );
      }
      return rejectWithValue({ message: (err as Error).message });
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    showSideNav(state, action) {
      state.showSideNav = action.payload;
    },
    resetSelectedProduct(state) {
      state.selectedProduct = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getProductDetails.pending, state => {
        state.selectedProduct = null;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.selectedProduct = null;
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      })
      .addCase(deleteProduct.pending, state => {
        state.loading = false;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      })
      .addCase(getProducts.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      })
      .addCase(getProductsByCategory.pending, (state, action) => {
        const section = action.meta.arg.section;
        if (section) {
          if (!state.Grouped[section]) {
            state.Grouped[section] = { loading: true, error: null, data: null };
          } else {
            state.Grouped[section].loading = true;
            state.Grouped[section].error = null;
          }
        }
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        const { section, products } = action.payload;
        if (section) {
          state.Grouped[section] = {
            loading: false,
            error: null,
            data: products
          };
        }
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        const section = action.meta.arg.section;
        if (section) {
          if (!state.Grouped[section]) {
            state.Grouped[section] = {
              loading: false,
              error: action.payload as FormErrorInterface,
              data: null
            };
          } else {
            state.Grouped[section].loading = false;
            state.Grouped[section].error = action.payload as FormErrorInterface;
          }
        }
      })
      .addCase(updateProductStatus.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        if (state.data) {
          state.data.products = state.data.products.map(product =>
            product.id === action.payload.id
              ? { ...product, status: action.payload.status }
              : product
          );
        }
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FormErrorInterface;
        state.success = false;
      });
  }
});

export default productSlice.reducer;
export const { showSideNav, resetSelectedProduct } = productSlice.actions;
