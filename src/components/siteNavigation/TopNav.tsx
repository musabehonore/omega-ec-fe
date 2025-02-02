'use client';

import React, { useEffect, useState } from 'react';

import { FC } from 'react';
import Link from 'next/link';
import {
  DecodedInterface,
  USER_ROLE,
  updateUserRole
} from '@/redux/slices/userSlice';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import useLogout from '@/app/(Authentication)/logout/page';

const TopNav: FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const logout = useLogout();

  useEffect(() => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const tokenData = tokenString;
      const decoded = tokenData
        ? (jwtDecode(tokenData) as DecodedInterface)
        : null;

      if (decoded) {
        setAuthenticated(true);
      }

      if (decoded && decoded.role === USER_ROLE.SELLER) {
        dispatch(updateUserRole(USER_ROLE.SELLER));
      }
    }
  }, [dispatch]);
  return (
    <nav className="bg-main-400 w-ful text-xs px-4 h-full py-0.5 flex items-center justify-between text-gray-200">
      <div className="w-1/10 text-xxs  uppercase">
        <Link href="/">ALPHA MARKET</Link>
      </div>
      <div className="w-max flex justify-between gap-6">
        {/* <label>
          <span className="text-main-200 text-xxs  uppercase">Currency: </span>
          USD
        </label>
        <label>
          <span className="text-main-200 text-xxs  uppercase">Language: </span>
          English
        </label> */}
        <span className="w-max flex justify-between items-center space-x-4 bg-base-yellow-700 px-2 text-main-200 font-bold rounded-lg cursor-pointer hover:bg-opacity-80">
          {authenticated ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </span>
      </div>
    </nav>
  );
};

export default TopNav;
