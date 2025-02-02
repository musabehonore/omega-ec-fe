'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GridListing from '@/components/products/GridListing';
import ProductLoading from '@/components/Loading/ProductsLoading';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { getProducts, showSideNav } from '@/redux/slices/ProductSlice';
import { getUserToken } from '@/redux/hooks/selectors';
import { fetchCart } from '@/redux/slices/cartSlice';
import { setAuthToken } from '@/redux/slices/userSlice';
import { fetchWishes } from '@/redux/slices/wishlistSlice';
import ProductsSideNav from '@/components/siteNavigation/ProductsSideNav';
import NotFound from '@/components/Loading/ProductNotFound';
import ProductNav from '@/components/siteNavigation/ProductsNav';
import AdsListing from '@/components/products/adsListing';
import LineLoading from '@/components/Loading/LineLoading';
import { Section } from '@/components/products/FashionListing';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(showSideNav(true));
  }, [dispatch]);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const userToken = useAppSelector(getUserToken);

  useEffect(() => {
    if (userToken !== null) {
      const handler = setTimeout(() => {
        dispatch(fetchWishes());
        dispatch(fetchCart());
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [dispatch, userToken]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);
          dispatch(setAuthToken(token));
        } catch (error) {
          console.error('Failed to parse token from localStorage', error);
        }
      }
    }
  }, [dispatch]);

  if (data) {
    return (
      <>
        <ProductNav />
        <div className="flex justify-between gap-4 min-w-screen p-0 w-full z-0">
          <ProductsSideNav />
          <GridListing data={data} />
        </div>
        {/* <Suspense fallback={<LineLoading title="ali express" bgColor={150} />}>
          <AdsListing title="Aliexpress" bgColor={100} section={Section.ADS} />
        </Suspense> */}
      </>
    );
  } else {
    return (
      <>
        <ProductNav />
        <div className="flex justify-between gap-4 min-w-screen p-0 w-full z-0">
          <ProductsSideNav />
          <ProductLoading />
        </div>
      </>
    );
  }
}
