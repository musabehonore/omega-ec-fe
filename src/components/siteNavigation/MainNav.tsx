'use client';

import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCT_ICONS, TOP_MENUS } from '@/utils/siteNavigation';
import { BsCart3 } from 'react-icons/bs';
import TopNav from './TopNav';
import PageLoading from '../Loading/PageLoading';
import { CiHeart } from 'react-icons/ci';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import { GrClose } from 'react-icons/gr';
import { VscMenu } from 'react-icons/vsc';
import {
  DecodedInterface,
  updateUserRole,
  USER_ROLE
} from '@/redux/slices/userSlice';
import { jwtDecode } from 'jwt-decode';

const MainNav: FC = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);
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

  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const { wishlist } = useAppSelector((state: RootState) => state.wishlist);
  const { wishlist2 } = useAppSelector((state: RootState) => state.wishlist);

  const { cart } = useAppSelector((state: RootState) => state.cart);

  const handleNavigation = (url: string) => {
    setPageLoading(true);
    router.push(url);
    setPageLoading(false);
  };

  if (pageLoading) return <PageLoading />;

  return (
    <div className="w-full flex flex-col h-30 mt-0 z-50 bg-main-100 fixed top-0 left-0 text-main-100">
      <TopNav />
      <nav className="w-full flex justify-between items-center py-0.5 px-4">
        <Link
          className="text-sm font-bold cursor-pointer px-4 py-1 text-main-400 flex items-center justify-between gap-4 rounded-md"
          href="/"
        >
          ALPHA
        </Link>
        <div className="hidden md:flex justify-between w-min gap-4">
          {TOP_MENUS.map((menu, index) => {
            const isActive =
              currentPath.includes('products') && menu.title === 'Products';
            return (
              <div
                key={index}
                className="block rounded text-gray-400 relative w-min group px-1"
              >
                <Link
                  href={menu.url}
                  passHref
                  className={`cursor:pointer relative block duration-200 transition-all ease-in-out ${
                    isActive
                      ? 'font-bold text-main-400'
                      : 'text-main-400 font-normal'
                  } cursor-pointer truncate `}
                >
                  {menu.icon && <menu.icon />}
                  <span className="hover:underline">{menu.label}</span>
                </Link>
              </div>
            );
          })}
        </div>

        <span
          onClick={e => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="flex cursor-pointer lg:hidden z-40 max-w-12 min-w-12 text-main-400 h-9 items-center justify-center bg-main-100 shadow-md border p-2 rounded-md"
        >
          {!showMenu ? (
            <VscMenu size={24} className="animate__animated  animate__faster" />
          ) : (
            <GrClose
              size={24}
              className="animate__animated animate__rotateIn animate__faster"
            />
          )}
        </span>
        <div className="w-min hidden lg:flex lg:flex-row justify-end gap-3">
          <Link
            href="/dashboard/cart"
            className="relative flex flex-col items-center justify-center cursor-pointer text-black p-1"
          >
            <BsCart3 size={24} />
            <span className="absolute top-0 right-0 bg-main-400 text-sm text-main-100 font-bold p-0.5 px-1 rounded-full">
              {cart?.products?.length || 0}
            </span>
            <label className="text-xxs text-black">CART</label>
          </Link>
          <Link
            href="/dashboard/wishlist"
            className="relative flex flex-col items-center justify-center cursor-pointer text-black p-1"
          >
            <CiHeart size={32} />
            <span className="absolute top-0 right-0 bg-main-400 text-sm text-main-100 font-bold p-0.5 px-1 rounded-full">
              {wishlist?.count || wishlist2?.count || 0}
            </span>
            <label className="text-xxs text-black">WISHLIST</label>
          </Link>
          {PRODUCT_ICONS.map((item, index) => {
            if (item.access === 'authenticated' && !authenticated) {
              return <></>;
            } else {
              return (
                <Link
                  href={item.url}
                  key={index + 10}
                  className="flex flex-col items-center justify-center cursor-pointer p-1 text-main-400"
                >
                  {item.icon && <item.icon size={24} />}
                  <label className="text-xxs text-black">{item.label}</label>
                </Link>
              );
            }
          })}
        </div>
        {showMenu === true && (
          <div
            onClick={e => {
              e.stopPropagation();
              setShowMenu(false);
            }}
            className="fixed z-30 mt-0.5 border-t-2 top-14 w-screen min-h-screen bg-black bg-opacity-50 shadow-lg lg:hidden right-0 flex justify-end"
          >
            <div
              onClick={e => {
                e.stopPropagation();
              }}
              className="border-2 gap-4 mt-0.5 p-4 animate__animated animate__fadeInRight animate__faster top-14 fixed z-50 min-w-72 right-0 min-h-screen bg-main-150 shadow-md"
            >
              <div className="w-full flex flex-row justify-center  gap-3">
                <Link
                  href="/dashboard/cart"
                  className="relative flex flex-col items-center justify-center cursor-pointer text-black p-1"
                >
                  <BsCart3 size={24} />
                  <span className="absolute top-0 right-0 bg-main-400 text-sm text-main-100 font-bold p-0.5 px-1 rounded-full">
                    {cart?.products?.length || 0}
                  </span>
                  <label className="text-xxs text-black">CART</label>
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  className="relative flex flex-col items-center justify-center cursor-pointer text-black p-1"
                >
                  <CiHeart size={32} />
                  <span className="absolute top-0 right-0 bg-main-400 text-sm text-main-100 font-bold p-0.5 px-1 rounded-full">
                    {wishlist?.count || wishlist2?.count || 0}
                  </span>
                  <label className="text-xxs text-black">WISHLIST</label>
                </Link>
                {PRODUCT_ICONS.map(
                  item =>
                    item.access === 'all' && (
                      <Link
                        href={item.url}
                        key={item.title}
                        className="flex flex-col items-center justify-center cursor-pointer p-1 text-main-400"
                      >
                        {item.icon && <item.icon size={24} />}
                        <label className="text-xxs text-black">
                          {item.label}
                        </label>
                      </Link>
                    )
                )}
              </div>
              <div className="flex md:hidden mt-6 flex-col gap-2 w-full h-full text-main-400">
                {TOP_MENUS.map((menu, index) => {
                  const isActive =
                    currentPath.includes('products') &&
                    menu.title === 'Products';
                  return (
                    <div
                      key={index}
                      className="block rounded text-gray-400 relative w-min group px-1"
                    >
                      <Link
                        href={menu.url}
                        passHref
                        className={`cursor:pointer relative block duration-200 transition-all ease-in-out ${
                          isActive
                            ? 'font-bold text-main-400'
                            : 'text-main-400 font-normal'
                        } cursor-pointer truncate `}
                      >
                        {menu.icon && <menu.icon />}
                        <span className="hover:underline">{menu.label}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MainNav;
