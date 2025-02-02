import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import productReducer, { getProducts } from '../redux/slices/ProductSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';
import { before } from 'lodash';
import { updateProduct } from '@/redux/slices/updateproductSlice';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    product: productReducer
  }
});

describe('product thunk', () => {
  const mock = new MockAdapter(axiosInstance);
  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });
  it('should delete product', async () => {
    const productId = 1;
    mock.onDelete(`${URL}/products/${productId}`).reply(200, {
      message: 'Product deleted successfully'
    });
    expect(store.getState().product.loading).toBe(false);
    expect(store.getState().product.error).toBeNull();
  });
});
