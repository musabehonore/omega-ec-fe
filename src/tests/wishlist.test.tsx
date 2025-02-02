import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';
import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import wishlistSlice, {
  addWishlist,
  fetchWishes
} from '@/redux/slices/wishlistSlice';
import { isWishedDataResponse2 } from '../redux/slices/wishlistSlice';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    wishlist: wishlistSlice
  }
});

describe('FETCH WISHLIST thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('Should fetch wishlist successfully', async () => {
    const wishlistFetched = {
      wishlist: {
        count: 1,
        rows: [
          {
            id: 'ff4cdd42-0e3a-46a8-a6c3-02451dd98657',
            name: 'Audi 2010',
            slug: 'Audi-2010',
            images: [
              'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827915/rz3jq81mzhtyixndfzea.jpg',
              'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827915/qnp9ltzbrjybo1hfyvoc.jpg',
              'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827915/epjmcqeyojyrswykf91z.jpg',
              'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718827918/bpszbnpdkl0fynux71e7.jpg'
            ],
            price: 12000,
            expiryDate: null,
            bonus: null,
            status: true,
            quantity: 24,
            description: '',
            averageRatings: null,
            reviewsCount: 0,
            createdAt: '2024-06-19T20:11:59.906Z',
            updatedAt: '2024-06-27T19:39:57.438Z',
            expired: false
          }
        ]
      }
    };

    mock.onGet(`${URL}/api/wishes`).reply(200, { data: wishlistFetched });

    await (store.dispatch as AppDispatch)(fetchWishes());

    const state = store.getState() as RootState;
    expect(state.wishlist.loading).toBe(false);
    expect(state.wishlist.status).toBe('succeeded');
  });
});

describe('WISHLIST thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('Should add to wishlist successfully', async () => {
    const wishlistFormData = {
      productId: '3348da1f-cf05-4b76-bbd6-4abebb6ab711'
    };

    const wishlist = {
      wishlist: {
        id: '712b0f72-b5a5-4c9d-863d-23bbc9b81636',
        userId: '47748694-036a-42b7-b20f-f9268c0c1e20',
        productId: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
        updatedAt: '2024-06-28T22:53:19.326Z',
        createdAt: '2024-06-28T22:53:19.326Z'
      },
      product: {
        id: '3348da1f-cf05-4b76-bbd6-4abebb6ab711',
        name: 'HYUNDAI TUCSON',
        slug: 'HYUNDAI-TUCSON-d95193b',
        images: [
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877933/yx7hyelp0r1a6yw90zdt.jpg',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/i6vp4amcr5wu0myhyrwv.webp',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877935/nvwzg1aqtftzobdpftmr.jpg',
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718877948/xl1x0duqh6p97bfimfco.jpg'
        ],
        price: 20000,
        expiryDate: null,
        bonus: null,
        status: true,
        quantity: 21,
        description:
          "The Hyundai Tucson is a stylish and powerful compact SUV. It has a bold design, a comfortable interior, and advanced technology like Apple CarPlay and Android Auto. The Tucson is safe and reliable, with features like lane keeping assist and blind-spot monitoring. You can choose from different engines, including a fuel-efficient hybrid option. Whether you're driving in the city or on rough roads, the Tucson is a great choice for any adventure.",
        averageRatings: 4,
        reviewsCount: 1,
        createdAt: '2024-06-20T10:05:49.864Z',
        updatedAt: '2024-06-28T14:47:43.001Z',
        expired: false
      }
    };

    mock.onPost(`${URL}/api/wishes`).reply(201, { data: wishlist });

    await (store.dispatch as AppDispatch)(addWishlist(wishlistFormData));

    const state = store.getState() as RootState;
    expect(state.wishlist.loading).toBe(false);
    expect(state.wishlist.status).toBe('succeeded');
  });

  it('Should fail to add to wishlist', async () => {
    const wishlistFormData = {
      productId: '1'
    };

    const wishlist = {
      id: '1234567890'
    };

    mock.onPost(`${URL}/api/wishes`).reply(400, { data: wishlist });

    await (store.dispatch as AppDispatch)(addWishlist(wishlistFormData));

    const state = store.getState() as RootState;
    expect(state.wishlist.loading).toBe(false);
    expect(state.wishlist.status).toBe('failed');
  });

  describe('Testing a seller function', () => {
    it('Should return true (seller)', () => {
      const data = {
        count: 1,
        rows: [
          {
            id: '1',
            userId: '2',
            productId: '3',
            createdAt: '2023-03-01T00:00:00.000Z',
            updatedAt: '2023-03-01T00:00:00.000Z',
            product: {
              id: '3',
              name: 'Product 1',
              slug: 'product-1',
              images: ['image1.jpg', 'image2.jpg'],
              price: 100,
              expiryDate: null,
              bonus: null,
              status: true,
              quantity: 10,
              description: 'Product 1 description',
              averageRatings: null,
              reviewsCount: 0,
              createdAt: '2023-03-01T00:00:00.000Z',
              updatedAt: '2023-03-01T00:00:00.000Z',
              expired: false
            }
          }
        ]
      };

      expect(isWishedDataResponse2(data)).toBe(true);
    });

    it('Should return false (not seller)', () => {
      const data = {
        id: '1234567890'
      };

      expect(isWishedDataResponse2(data)).toBe(false);
    });
  });
});
