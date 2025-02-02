import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import updateReducer, {
  FormDataInterface,
  updatePassword
} from '../redux/slices/updatePasswordSlice';
import updatepasswordReducer from '../redux/slices/updatePasswordSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
const store = configureStore({
  reducer: {
    updatePassword: updatepasswordReducer
  }
});
let token2 = '';
describe('updatePassword thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });
  it('should dispatch fulfilled when updatePassword is successful', async () => {
    const password: FormDataInterface = {
      oldPassword: '1111@Example',
      confirmPassword: '1111@Eaa',
      newPassword: '1111@Eaa'
    };
    const response = {
      message: 'Password changed successfully'
    };
    mock.onPost(`${URL}/api/users/change-password`).reply(200, response);
  });
  it('should dispatch fulfilled when updating is successful', async () => {
    const password: FormDataInterface = {
      oldPassword: '1111@Example',
      confirmPassword: '1111@Eaa',
      newPassword: '1111@Eaa'
    };
    const response = {
      message: 'Password changed successfully'
    };
    mock.onPost(`${URL}/api/users/change-password`).reply(200, response);

    const result = await (store.dispatch as AppDispatch)(
      updatePassword(password)
    );

    const state = store.getState() as RootState;
    expect(state.updatePassword.loading).toBe(false);
    expect(state.updatePassword.success).toBe(true);
  });

  it('should dispatch rejected when updatePassword fails', async () => {
    const password: FormDataInterface = {
      oldPassword: '1111@Example',
      confirmPassword: '1111@Eaa',
      newPassword: '1111@Eaa'
    };
    const errorResponse = { message: 'Update password failed' };

    mock.onPost(`${URL}/api/users/change-password`).reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(updatePassword(password));

    const state = store.getState() as RootState;
    expect(state.updatePassword.loading).toBe(false);
    expect(state.updatePassword.success).toBe(false);
  });
});
