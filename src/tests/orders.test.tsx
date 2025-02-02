import reducer, {
  setorders,
  setLoading,
  setError,
  OrdersState,
  IOrder
} from '@/redux/slices/ordersSlice';
import { render, screen } from '@testing-library/react';
import OrderCard from '@/components/order/orderCard';

describe('ordersSlice', () => {
  const initialState: OrdersState = {
    orders: [],
    loading: true,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setorders', () => {
    const previousState: OrdersState = { ...initialState, loading: false };
    const newOrders: IOrder[] = [
      {
        id: '1',
        orderBuyer: { name: 'John Doe', photoUrl: null },
        orderedProduct: { images: ['img1.jpg'], name: 'Product 1', price: 100 },
        quantity: 1,
        status: 'pending',
        createdAt: '2023-07-01T00:00:00.000Z',
        updatedAt: '2023-07-01T00:00:00.000Z'
      }
    ];

    expect(reducer(previousState, setorders(newOrders))).toEqual({
      ...previousState,
      orders: newOrders
    });
  });

  it('should handle setLoading', () => {
    const previousState: OrdersState = { ...initialState, loading: false };

    expect(reducer(previousState, setLoading(true))).toEqual({
      ...previousState,
      loading: true
    });
  });

  it('should handle setError', () => {
    const previousState: OrdersState = { ...initialState, error: null };
    const error = 'Error loading orders';

    expect(reducer(previousState, setError(error))).toEqual({
      ...previousState,
      error
    });
  });
});
