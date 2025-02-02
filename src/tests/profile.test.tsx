import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import profileReducer, {
  fetchProfile,
  updateProfile,
  ProfileFormData
} from '../redux/slices/profileSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance, URL } from '@/utils';
import loginReducer, {
  logInUser,
  LogInInterface
} from '../redux/slices/loginSlice';
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const store = configureStore({
  reducer: {
    profile: profileReducer,
    login: loginReducer
  }
});

describe('FETCH PROFILE thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should fetch profile successfully', async () => {
    const profileData = {
      name: 'Musana Musana',
      birthdate: '1990-01-01',
      gender: 'Male',
      address: '123 Main St',
      preferedcurrency: 'USD',
      preferedlanguage: 'English'
    };

    mock.onGet(`${URL}/api/users/profile`).reply(200, { data: profileData });

    const result = await (store.dispatch as AppDispatch)(fetchProfile());

    const state = store.getState() as RootState;
    expect(state.profile.loading).toBe(false);
    expect(state.profile.status).toBe('succeeded');
  });
});

describe('UPDATE PROFILE thunk', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should LOGIN', async () => {
    const userData: LogInInterface = {
      email: 'test10@example.com',
      password: '1111@aa'
    };

    const response = {
      status: 'Success!',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3NzQ4Njk0LTAzNmEtNDJiNy1iMjBmLWY5MjY4YzBjMWUyMCIsImlhdCI6MTcxODI3NTI3MywiZXhwIjoxNzE4MjgyNDczfQ.AsxXeXH2cdEKWUcyrg_M2VsR_RnW18Bg92WEWQKqnpU',
      message: 'Logged In Successfully'
    };

    mock.onPost(`${URL}/api/users/login`).reply(200, response);

    const result = await (store.dispatch as AppDispatch)(logInUser(userData));

    const state2 = store.getState() as RootState;
    expect(state2.login.loading).toBe(false);
    expect(state2.login.success).toBe(true);
  });

  it('should update profile successfully', async () => {
    const profileData: ProfileFormData = {
      name: 'Musana Musana',
      gender: 'male'
    };

    const response = {
      status: 'Success!',
      data: {
        id: '47748694-036a-42b7-b20f-f9268c0c1e20',
        name: 'Musana Musana',
        email: 'test10@example.com',
        gender: 'male',
        birthdate: '2008-06-19',
        preferedlanguage: null,
        preferedcurrency: 'Dollar',
        phone: '0788691201',
        address: 'Kigali',
        googleId: null,
        photoUrl:
          'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1718202465/yjndoxhegphow9hugfu6.png',
        verified: true,
        status: true,
        createdAt: '2024-05-17T10:12:50.405Z',
        updatedAt: '2024-06-12T14:27:46.713Z',
        lastTimePasswordUpdated: '2024-06-09T18:14:18.235Z'
      },
      message: 'profile updated successfully!'
    };

    mock.onPatch(`${URL}/api/users/profile`).reply(200, response);

    const formData = new FormData();
    for (const key in profileData) {
      if (
        profileData[key as keyof ProfileFormData] !== undefined &&
        profileData[key as keyof ProfileFormData] !== null
      ) {
        formData.append(
          key,
          profileData[key as keyof ProfileFormData] as Blob | string
        );
      }
    }

    const result = await (store.dispatch as AppDispatch)(
      updateProfile(formData)
    );

    const state = store.getState() as RootState;
    expect(state.profile.loading).toBe(false);
    expect(state.profile.status).toBe('succeeded');
  });

  it('should fail updating profile', async () => {
    const profileData: ProfileFormData = {
      name: 'Musana Musana',
      birthdate: '1990-01-01',
      gender: 'Male',
      address: '123 Main St',
      preferedcurrency: 'USD',
      preferedlanguage: 'English'
    };

    const errorResponse = { message: 'Updating profile failed' };

    mock.onPut(`${URL}/api/users/profile`).reply(400, errorResponse);

    const formData = new FormData();
    for (const key in profileData) {
      if (
        profileData[key as keyof ProfileFormData] !== undefined &&
        profileData[key as keyof ProfileFormData] !== null
      ) {
        formData.append(
          key,
          profileData[key as keyof ProfileFormData] as Blob | string
        );
      }
    }

    const result = await (store.dispatch as AppDispatch)(
      updateProfile(formData)
    );

    const state = store.getState() as RootState;
    expect(state.profile.loading).toBe(false);
    expect(state.profile.status).toBe('failed');
  });
});
