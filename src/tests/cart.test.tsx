import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import cartSlice, {
  addToCart,
  deleteCart,
  fetchCart,
  removeFromCart,
  updateCart
} from '@/redux/slices/cartSlice';
import loginReducer, {
  logInUser,
  LogInInterface
} from '../redux/slices/loginSlice';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    cart: cartSlice,
    login: loginReducer
  }
});

describe('FETCH CART thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('Should fetch cart successfully', async () => {
    const cartFetched = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f',
      products: [
        {
          id: 'aed076f5-c354-4d69-8997-7ba61ef172cb',
          name: 'RANGE-ROVER',
          price: 5000,
          images: [
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827919/r7twmfa02fiffml7ysjw.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827920/rovawehkhzey2ba08rjn.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827920/t1inz8cnurj1as3qh96q.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827926/e9efbh3kmzpsmdzr1wkm.jpg'
          ],
          quantity: '1'
        }
      ],
      totalprice: 5000
    };

    mock.onGet(`${URL}/api/carts`).reply(200, { data: cartFetched });

    await (store.dispatch as AppDispatch)(fetchCart());

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('succeeded');
  });
});

describe('CART thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('Should add to cart successfully', async () => {
    const cartFormData = {
      productId: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
      quantity: '1'
    };

    const cartResponse = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f',
      products: [
        {
          id: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
          name: 'HYUNDAI TUCSON',
          price: 20000,
          images: [
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877933/yx7hyelp0r1a6yw90zdt.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/i6vp4amcr5wu0myhyrwv.webp',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/nvwzg1aqtftzobdpftmr.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877948/xl1x0duqh6p97bfimfco.jpg'
          ],
          quantity: '1'
        }
      ],
      totalprice: 20000
    };

    mock.onPost(`${URL}/api/carts`).reply(201, { data: cartResponse });

    await (store.dispatch as AppDispatch)(addToCart(cartFormData));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('succeeded');
  });

  it('Should fail to add to cart', async () => {
    const cartFormData = {
      productId: '1',
      quantity: 'd'
    };

    const cartResponse = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f'
    };

    mock.onPost(`${URL}/api/carts`).reply(400, { data: cartResponse });

    await (store.dispatch as AppDispatch)(addToCart(cartFormData));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('failed');
  });

  it('Should fail to remove from cart', async () => {
    const productId = '3348da1f-cf05-4b76-bbd6-4abebb6ab711';

    const cartResponse = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f',
      products: [],
      totalprice: 0
    };

    mock.onPost(`${URL}/api/carts`).reply(200, { data: cartResponse });

    await (store.dispatch as AppDispatch)(removeFromCart(productId));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('failed');
  });

  it('Should update cart successfully', async () => {
    const formData2 = {
      productId: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
      quantity: '2'
    };
    const cartId = '3348da1f-cf05-4b76-bbd6-4abebb6ab711';

    const cartResponse = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f',
      products: [
        {
          id: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
          name: 'HYUNDAI TUCSON',
          price: 20000,
          images: [
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877933/yx7hyelp0r1a6yw90zdt.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/i6vp4amcr5wu0myhyrwv.webp',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/nvwzg1aqtftzobdpftmr.jpg',
            'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877948/xl1x0duqh6p97bfimfco.jpg'
          ],
          quantity: '2'
        }
      ],
      totalprice: 40000
    };

    mock
      .onPatch(`${URL}/api/carts/${cartId}`)
      .reply(201, { data: cartResponse });

    await (store.dispatch as AppDispatch)(updateCart({ cartId, formData2 }));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('succeeded');
  });

  it('Should fail to update cart', async () => {
    const formData2 = {
      productId: '1',
      quantity: 'd'
    };
    const cartId = '3';

    const cartResponse = {
      id: '3e33dfe4-3355-45e2-8f3b-33dabcac319f'
    };

    mock
      .onPatch(`${URL}/api/carts/${cartId}`)
      .reply(400, { data: cartResponse });

    await (store.dispatch as AppDispatch)(updateCart({ cartId, formData2 }));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('failed');
  });

  it('Should delete cart successfully', async () => {
    const cartId = '3348da1f-cf05-4b76-bbd6-4abebb6ab711';

    mock.onDelete(`${URL}/api/carts/${cartId}`).reply(201, { data: null });

    await (store.dispatch as AppDispatch)(deleteCart(cartId));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('succeeded');
  });

  it('Should fail to delete cart', async () => {
    const cartId = '4';

    mock.onDelete(`${URL}/api/carts/${cartId}`).reply(400, { data: null });

    await (store.dispatch as AppDispatch)(deleteCart(cartId));

    const state = store.getState() as RootState;
    expect(state.cart.loading).toBe(false);
    expect(state.cart.status).toBe('failed');
  });
});
