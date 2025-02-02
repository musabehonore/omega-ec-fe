import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import otpReducer, {
  verifyOtp,
  setUserToken,
  clearUserToken
} from '../redux/slices/otpSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    otp: otpReducer
  }
});

describe('verifyOtp thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should login and verify OTP successfully', async () => {
    const loginResponse = {
      status: 'Success!',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      message: 'Seller login successful'
    };

    mock.onPost('/users/login').reply(200, loginResponse);

    const token = loginResponse.data;

    const otp = '822198';
    const otpResponse = {
      status: 'Success!',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      message: 'OTP verified successfully'
    };
    mock.onPost(`/users/verify/${token}`).reply(200, otpResponse);

    const otpResult = await (store.dispatch as any)(verifyOtp({ otp, token }));
    const otpState = store.getState() as RootState;

    expect(otpState.otp.loading).toBe(false);
    expect(otpState.otp.success).toBe(true);
  });

  it('should set user token correctly', () => {
    store.dispatch(setUserToken('test-token'));
    const state = store.getState();
    expect(state.otp.userToken).toBe('test-token');
  });

  it('should clear user token correctly', () => {
    store.dispatch(setUserToken('test-token'));
    store.dispatch(clearUserToken());
    const state = store.getState();
    expect(state.otp.userToken).toBe(null);
  });

  it('should dispatch rejected when OTP verification fails', async () => {
    const otp: string = '786756';
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const errorResponse = { message: 'Verification failed' };

    mock.onPost(`${URL}/users/verify/${token}`).reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(verifyOtp({ otp, token }));

    const state = store.getState() as RootState;
    expect(state.otp.loading).toBe(false);
    expect(state.otp.success).toBe(false);
  });
});
