import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance } from '@/utils';
import dotenv from 'dotenv';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '@/redux/slices/notificationSlice';
import notificationsReducer from '@/redux/slices/notificationSlice';
dotenv.config({ path: '.env.local' });

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
const store = configureStore({
  reducer: {
    notifications: notificationsReducer
  }
});
const URL = process.env.NEXT_PUBLIC_API_URL;

describe('usersSlice tests', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fetchNotifications.rejected when API call fails', async () => {
    const errorMessage = 'Rejected';

    mock
      .onGet(`${URL}/api/notifications`)
      .reply(500, { message: errorMessage });

    await store.dispatch(fetchNotifications() as any);

    const state = store.getState() as RootState;
    expect(state.notifications.loading).toBe(false);
  });
  it('should dispatch fetchNotifications function when fullfilled', async () => {
    const successMessage = {
      status: 'Success!',
      data: [
        {
          id: '4938cd46-bb96-4cc5-b968-b17d8706f18a',
          message: 'John added the product to their wishlist(shoes)',
          isRead: true,
          event: 'PRODUCT_WISHLIST_UPDATE',
          createdAt: '2024-07-05T17:25:47.104Z'
        },
        {
          id: '397777f5-2043-4922-b87c-b897b66ce7d9',
          message: 'John removed the product from their wishlist(shoes)',
          isRead: true,
          event: 'PRODUCT_WISHLIST_UPDATE',
          createdAt: '2024-07-05T14:14:48.643Z'
        }
      ],
      message: 'All notifications retrieved.'
    };

    mock
      .onGet(`${URL}/api/notifications`)
      .reply(200, { message: successMessage });
    await (store.dispatch as AppDispatch)(fetchNotifications());

    const state = store.getState() as RootState;
    console.log('stateeee', state.notifications.error);
    expect(state.notifications.loading).toBe(false);
  });

  it('should dispatch markAllNotificationsAsRead function when API fails', async () => {
    const errorMessage = 'Rejected';

    mock
      .onPatch(`${URL}/api/notifications/markall`)
      .reply(500, { message: errorMessage });

    await store.dispatch(markAllNotificationsAsRead() as any);

    const state = store.getState().notifications;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.success).toBe(false);
  });
  it('should dispatch markAllNotificationsAsRead function in case of fullfilled', async () => {
    const successMessage = {
      status: 'Success!',
      data: [],
      message: 'All notifications marked as read.'
    };

    mock
      .onPatch(`${URL}/api/notifications/markall`)
      .reply(200, { message: successMessage });

    // const value = await store.dispatch(markAllNotificationsAsRead() as any);
    await (store.dispatch as AppDispatch)(markAllNotificationsAsRead());

    const state = store.getState() as RootState;
    console.log('stateeee', state.notifications.error);
    expect(state.notifications.loading).toBe(false);
  });
  it('should dispatch mark single notification as read when API rejected', async () => {
    const errorMessage = 'Rejected';
    const id = '39d3b917-d5b9-40e6-bf42-d3d9993dad44';

    mock
      .onPatch(`${URL}/api/notifications/${id}`)
      .reply(500, { message: errorMessage });

    await store.dispatch(markNotificationAsRead(id) as any);

    const state = store.getState().notifications;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.success).toBe(false);
  });
});
