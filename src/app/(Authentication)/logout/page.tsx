'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logoutUser } from '@/redux/slices/userSlice';

const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
    window.location.href = '/';
  };

  return logout;
};

export default useLogout;
