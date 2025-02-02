import { createSlice } from '@reduxjs/toolkit';

export interface IOrder {
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

export interface OrdersState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: true,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setorders: (state, action) => {
      state.orders = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setorders, setLoading, setError } = ordersSlice.actions;

export default ordersSlice.reducer;
