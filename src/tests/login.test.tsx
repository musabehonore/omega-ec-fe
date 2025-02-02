import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { logInUser, LogInInterface } from '../redux/slices/userSlice';
import userReducer from '../redux/slices/userSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

describe('loginUser thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fulfilled when login is successful', async () => {
    const userData: LogInInterface = {
      email: 'elyse@gmail.com',
      password: 'Password123!'
    };

    const response = {
      status: 'Success!',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      message: 'OTP verified successfully'
    };

    mock.onPost(`${URL}/api/users/login`).reply(200, response);

    const result = await (store.dispatch as AppDispatch)(logInUser(userData));

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(state.user.success).toBe(true);
  });

  it('should dispatch rejected when login fails', async () => {
    const userData: LogInInterface = {
      email: 'erice@gmail.com',
      password: 'Password123!'
    };

    const errorResponse = { message: 'login failed' };

    mock.onPost(`${URL}/api/users/login`).reply(400, errorResponse);

    const result = await (store.dispatch as AppDispatch)(logInUser(userData));

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(state.user.success).toBe(false);
  });
});
