import { configureStore, AnyAction, UnknownAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance } from '@/utils';

import dotenv from 'dotenv';
import updateProductSlice, {
  updateProduct
} from '@/redux/slices/updateproductSlice';
import { deleteProduct } from '@/redux/slices/ProductSlice';
dotenv.config({ path: '.env.local' });

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
const store = configureStore({
  reducer: {
    updateproduct: updateProductSlice
  }
});
const URL = process.env.NEXT_PUBLIC_API_URL;

const productInfo = {
  productId: '37b538af-2590-4faf-9425-45e3b26d93f1',
  productData: {
    name: 'Product 1',
    price: 9.99,
    description: 'Description for product 1',
    category: 'Category 1',
    image: 'https://example.com/image1.jpg'
  }
};

describe.only('updateProductSlice tests', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fetchAllUsers.rejected when API call fails', async () => {
    const prod = {
      status: 'Success!',
      data: {
        d: '80764868-2595-44d3-9029-059f1ec485b4',
        name: 'mitsubishi',
        slug: 'mitsubishi',
        images: [
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1719869401/c5ohuj8yrsrdmiolg6ly.jpg',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1719869405/tmydgufvbzu4dcraggve.jpg',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1719869405/v74pwxjeljbotwudym91.jpg',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1719869408/wctstkvourliy8gczfqv.jpg'
        ],
        price: 5000,
        expiryDate: null,
        bonus: null,
        status: true,
        quantity: 10,
        description: '',
        averageRatings: 0,
        reviewsCount: 0,
        createdAt: '2024-06-27T19:28:45.136Z',
        updatedAt: '2024-07-01T21:30:08.891Z',
        expired: false
      },
      message: 'Product updated successfully!'
    };
    mock
      .onPatch(`${URL}/api/products/${productInfo.productId}`)
      .reply(500, { message: prod });

    await store.dispatch(updateProduct(productInfo));

    const state = store.getState().updateproduct;
    expect(state.loading).toBe(false);
  });

  it('should dispatch updateproduct.rejected when API call fails', async () => {
    const errorMessage = 'Rejected';

    mock
      .onPatch(`${URL}/api/products/58f41fc6-b8c6-4d6a-9b7f-2608cd5a3e08`)
      .reply(500, { message: errorMessage });

    await store.dispatch(updateProduct(productInfo));

    const state = store.getState().updateproduct;
    expect(state.loading).toBe(false);
  });
  it('should dispatch disableAccount.rejected when API call fails', async () => {
    const errorMessage = 'Rejected';

    mock
      .onDelete(`${URL}/api/products/${productInfo.productId}`)
      .reply(500, { message: errorMessage });

    await store.dispatch(deleteProduct(productInfo.productId));

    const state = store.getState().updateproduct;
    expect(state.loading).toBe(false);
  });
  it('should dispatch updateProduct.fulfilled when API call succeeds', async () => {
    const successMessage = 'Product updated successfully!';
    const updatedProduct = {
      ...productInfo.productData,
      id: productInfo.productId
    };

    mock
      .onPatch(`${URL}/api/products/${productInfo.productId}`)
      .reply(200, { message: successMessage, data: updatedProduct });

    const result = await store.dispatch(updateProduct(productInfo));

    const state = store.getState().updateproduct;
    expect(state.loading).toBe(false);
  });
});
