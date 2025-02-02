import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import productReducer, {
  getProducts,
  updateProductStatus
} from '../redux/slices/ProductSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    product: productReducer
  }
});

describe('Products thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fulfilled when products fetched successfully', async () => {
    const products = {
      rows: [
        {
          id: 1,
          name: 'MAZDA',
          categoryId: '2d854884-ea82-468f-9883-c86ce8d5a001',
          price: 5000
        },
        {
          id: 2,
          name: 'MAZDA',
          categoryId: '2d854884-ea82-468f-9883-c86ce8d5a001',
          price: 5000
        }
      ],
      count: 10
    };

    const response = {
      status: 'Success!',
      data: products,
      message: 'Products fetched successfully'
    };

    mock.onGet(`${URL}/api/products`).reply(200, response);

    const query = {};
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
  });

  it('should dispatch Rejected when products fetch fails', async () => {
    const errorResponse = {
      status: 'Error!',
      data: [],
      message: 'Failed to fetch products'
    };

    mock.onGet(`${URL}/api/products`).reply(400, errorResponse);

    const query = {};
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
    expect(state.product.success).toBe(false);
    expect(state.product.error).toBe('Failed to fetch products');
  });

  it('should dispatch Rejected when products details fetch fails', async () => {
    const productsId = '274cadfe-638b-465d-bdc4-7a5cadae1c1c';

    const errorResponse = {
      status: 'Error!',
      data: [],
      message: 'Failed to fetch products'
    };

    mock
      .onGet(`${URL}/api/products/details?productId=${productsId}`)
      .reply(400, errorResponse);

    const query = {};
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
    expect(state.product.success).toBe(false);
    expect(state.product.error).toBe('Failed to fetch products');
  });

  it('should dispatch Rejected when products details fetch fails', async () => {
    const productsId = '274cadfe-638b-465d-bdc4-7a5cadae1c1c';

    const response = {
      status: 'Success!',
      data: [],
      message: 'product fetched successfully'
    };

    mock
      .onGet(`${URL}/api/products/details?productId=${productsId}`)
      .reply(200, response);

    const query = {};
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
  });

  it('should dispatch fulfilled when fetching with specific query parameters', async () => {
    const products = {
      rows: [
        {
          id: 3,
          name: 'TOYOTA',
          categoryId: '2d854884-ea82-468f-9883-c86ce8d5a002',
          price: 10000
        }
      ],
      count: 1
    };

    const response = {
      status: 'Success!',
      data: products,
      message: 'Products fetched successfully'
    };

    mock.onGet(`${URL}/api/products?priceLessThan=15000`).reply(200, response);

    const query = { priceLessThan: 15000 };
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
  });

  it('should dispatch fulfilled when fetching with specific query parameters', async () => {
    const products = {
      rows: [
        {
          id: 3,
          name: 'TOYOTA',
          categoryId: '2d854884-ea82-468f-9883-c86ce8d5a002',
          price: 10000
        }
      ],
      count: 1
    };

    const response = {
      status: 'Success!',
      data: products,
      message: 'Products fetched successfully'
    };

    mock
      .onGet(
        `${URL}/api/products?priceGreaterThan=0&priceLessThan=28200&sellerId=00c4d935-4bae-492c-996d-d36ee0096817`
      )
      .reply(200, response);

    const query = { priceLessThan: 15000 };
    await (store.dispatch as AppDispatch)(getProducts(query));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
  });
  // it('should dispatch fulfilled when product status updated successfully', async () => {
  //   const productId = '1';
  //   const response = {
  //     data: { id: productId },
  //     message: 'Product status updated successfully'
  //   };

  //   mock.onPatch(`${URL}/api/products/${productId}/status`).reply(200, response);

  //   await (store.dispatch as AppDispatch)(updateProductStatus(productId));

  //   const state = store.getState() as RootState;
  //   expect(state.product.loading).toBe(false);
  // });

  it('should dispatch rejected when product status update fails', async () => {
    const productId = '1';
    const errorResponse = {
      status: 'Error!',
      message: 'Failed to update product status'
    };

    mock
      .onPatch(`${URL}/api/products/${productId}/status`)
      .reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(updateProductStatus(productId));

    const state = store.getState() as RootState;
    expect(state.product.loading).toBe(false);
    expect(state.product.error).toEqual(errorResponse);
  });
});
