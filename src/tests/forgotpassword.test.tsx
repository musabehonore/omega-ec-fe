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
    forgotpassword: forgotpasswordReducer
  }
});
let token2 = '';
describe('forgotpassword thunk', () => {
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
    const response = {
      message:
        'Password Reset Successfully! Please login with your new password!'
    };

    mock.onPost(`${URL}/api/users/forgot-password`).reply(200, response);

    const state = store.getState() as RootState;
    expect(state.forgotpassword.loading).toBe(false);
    expect(state.forgotpassword.success).toBe(true);
  });

  it('should dispatch rejected when forgotpassword fails', async () => {
    const errorResponse = { message: 'Reset password failed' };

    mock.onPatch(`${URL}/api/forgot-password`).reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(
      forgotpassword('sofidele12@gmail.com')
    );

    const state = store.getState() as RootState;
    expect(state.forgotpassword.loading).toBe(false);
    expect(state.forgotpassword.success).toBe(false);
  });
});
