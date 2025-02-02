import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import resetpasswordReducer, {
  resetpassword
} from '../redux/slices/ResetpasswordSlice';
import forgotpasswordReducer from '../redux/slices/ForgotpasswordSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';
import { ResetPasswordFormDataInterface } from '@/app/(Authentication)/reset-password/page';
import loginReducer, {
  LogInInterface,
  logInUser
} from '@/redux/slices/userSlice';
import {
  UserInterface,
  forgotpassword
} from '@/redux/slices/ForgotpasswordSlice';
import ForgotPassword from '@/app/(Authentication)/forgot-password/page';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    resetpassword: resetpasswordReducer,
    login: loginReducer,
    forgotpassword: forgotpasswordReducer
  }
});
let token2 = '';
describe('resetpassword thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });
  it('should sent reset email through forgot password', async () => {
    const response2 = {
      status: 'Success!',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwNjBkOWEwLWZhZmYtNGJlMy04OWQyLTZkZTVkODY5YmIxNCIsImlhdCI6MTcxODM4MzQyMiwiZXhwIjoxNzE4Mzg0MzIyfQ.aDhNEbMxIUnUBLlv0mr57PqaGXrw9fTC66FYtdwhhGc',
      message: 'Password reset link sent successfully!'
    };
    mock.onPost(`${URL}/api/users/forgot-password`).reply(200, response2);
    token2 = response2.data;

    await (store.dispatch as AppDispatch)(
      forgotpassword('sofidele12@gmail.com')
    );
  });

  it('should dispatch fulfilled when resetpassword is successful', async () => {
    const userData: ResetPasswordFormDataInterface = {
      password: 'Sophie1992@',
      confirmPassword: 'Sophie1992@'
    };

    const response = {
      message:
        'Password Reset Successfully! Please login with your new password!'
    };

    mock
      .onPatch(`${URL}/api/users/reset-password/${token2}`)
      .reply(200, response);

    const result = await (store.dispatch as AppDispatch)(
      resetpassword(userData)
    );

    const state = store.getState() as RootState;
    expect(state.resetpassword.loading).toBe(false);
    expect(state.resetpassword.success).toBe(true);
  });

  it('should dispatch rejected when resetpassword fails', async () => {
    const userData: ResetPasswordFormDataInterface = {
      password: 'Sophie1992@',
      confirmPassword: 'Sophie1992@'
    };

    const errorResponse = { message: 'Reset password failed' };

    mock.onPatch(`${URL}/api/reset-password`).reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(resetpassword(userData));

    const state = store.getState() as RootState;
    expect(state.resetpassword.loading).toBe(false);
    expect(state.resetpassword.success).toBe(false);
  });
});
