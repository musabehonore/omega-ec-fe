import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import usersSlice from '@/redux/slices/userSlice';
import { assignRole } from '@/redux/slices/disableaccount';

const mock = new MockAdapter(axios);

const store = configureStore({
  reducer: {
    users: usersSlice
  }
});

describe('assignRole thunk', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('dispatches fulfilled action when role assignment is successful', async () => {
    const userId = '0c825a51-e95a-45ee-92a0-b5404017aa21';
    const roleId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
    mock.onPost('/users/roles').reply(200, {
      status: 'Success!',
      data: null,
      message: 'Role assigned successfully!'
    });
    await store.dispatch(assignRole({ userId, roleId }));
    const state = store.getState();
    expect(state.users.loading).toBe(false);
    expect(state.users.success).toBe(false);
  });

  it('dispatches rejected action when role assignment fails', async () => {
    const userId = '0c825a51-e95a-45ee-92a0-b5404017aa21';
    const roleId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
    mock.onPost('/users/roles').reply(400, { message: 'Error assigning role' });
    await store.dispatch(assignRole({ userId, roleId }));
    const state = store.getState();
    expect(state.users.loading).toBe(false);
    expect(state.users.success).toBe(false);
  });
});
