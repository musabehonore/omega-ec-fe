import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import userReducer, {
  UserRegistrationInterface,
  registerUser
} from '../redux/slices/userSlice.ts';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

describe('registerUser thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fulfilled when registration is successful', async () => {
    const userData: UserRegistrationInterface = {
      name: 'Eric',
      email: 'ericer@gmail.com',
      password: 'Password123!',
      phone: '0780313448',
      address: '123 Main St'
    };

    const response = { message: 'Registered successfully' };

    mock.onPost(`${URL}/api/users/register`).reply(200, response);

    const result = await (store.dispatch as AppDispatch)(
      registerUser(userData)
    );

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(state.user.success).toBe(true);
  });

  it('should dispatch rejected when registration fails', async () => {
    const userData: UserRegistrationInterface = {
      name: 'Eric',
      email: 'erice@gmail.com',
      password: 'Password123!',
      phone: '0780313448',
      address: '123 Main St'
    };

    const errorResponse = { message: 'Registration failed' };

    mock.onPost(`${URL}/api/users/register`).reply(400, errorResponse);

    const result = await (store.dispatch as AppDispatch)(
      registerUser(userData)
    );

    const state = store.getState() as RootState;
    expect(state.user.loading).toBe(false);
    expect(state.user.success).toBe(false);
  });
});
