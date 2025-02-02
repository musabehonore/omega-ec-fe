import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { logoutUser } from '../redux/slices/userSlice.ts';
import userReducer from '../redux/slices/userSlice.ts';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

describe('logoutUser thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    localStorage.clear();
    store.dispatch({ type: 'reset' });

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    localStorage.setItem('token', JSON.stringify(token));
  });

  it('should dispatch fulfilled when logout is successful', async () => {
    mock.onPost(`${URL}/api/users/logout`).reply(200);

    const result = await (store.dispatch as AppDispatch)(logoutUser());

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(result.type).toBe('authentication/logoutUser/fulfilled');
    expect(result.payload).toBe(true);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should dispatch rejected when logout fails', async () => {
    const errorResponse = { message: 'Logout failed' };

    mock.onPost(`${URL}/api/users/logout`).reply(400, errorResponse);

    const result = await (store.dispatch as AppDispatch)(logoutUser());

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(result.type).toBe('authentication/logoutUser/rejected');
    expect(result.payload).toEqual({ message: { message: 'Logout failed' } });
    expect(localStorage.getItem('token')).not.toBeNull();
  });
});
