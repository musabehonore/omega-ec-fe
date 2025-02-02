import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import otpReducer from './slices/otpSlice';
import resetpasswordReducer from './slices/ResetpasswordSlice';
import forgotPasswordReducer from './slices/ForgotpasswordSlice';
import productReducer from './slices/ProductSlice';
import categoriesReducer from './slices/categorySlice';
import sellerReducer from './slices/sellerSlice';
import usersReducer from './slices/disableaccount';
import profileReducer from './slices/profileSlice';
import itemReducer from './slices/itemSlice';
import updatePasswordReducer from './slices/updatePasswordSlice';
import chatsReducer from './slices/chatSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import paymentReducer from './slices/payment';
import updateprofilereducer from './slices/updateproductSlice';
import notificationsReducer from './slices/notificationSlice';
import updateorderstatusreducer from './slices/updateorderstatusSlice';
import adsReducer from './slices/adsSlice';
import statsReducer from './slices/stasticsSlice';

export const rootReducer = combineReducers({
  otp: otpReducer,
  products: productReducer,
  categories: categoriesReducer,
  Resetpassword: resetpasswordReducer,
  forgotPassword: forgotPasswordReducer,
  sellers: sellerReducer,
  user: userReducer,
  registereUsers: usersReducer,
  profile: profileReducer,
  product: itemReducer,
  updatePassword: updatePasswordReducer,
  users: userReducer,
  chat: chatsReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  orders: ordersReducer,
  payment: paymentReducer,
  updateproduct: updateprofilereducer,
  notifications: notificationsReducer,
  updateorderstatus: updateorderstatusreducer,
  ads: adsReducer,
  stats: statsReducer
});

export const store = configureStore({
  reducer: rootReducer
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
