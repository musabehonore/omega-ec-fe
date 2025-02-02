import { createAction } from '@reduxjs/toolkit';
import { UserRegistrationInterface } from '../slices/userSlice';
import { UserInterface } from '../slices/ResetpasswordSlice';

export const registerUser = createAction<UserRegistrationInterface>(
  'authentication/registerUser'
);
export const loginUser = createAction<UserRegistrationInterface>(
  'authentication/loginUser'
);
export const resetpassword = createAction<UserInterface>(
  'authentication/resetpassword'
);

export const allUsers = createAction<UserInterface>('users/fetchAllUsers');
