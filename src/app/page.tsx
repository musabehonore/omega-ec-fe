'use client';

import React, { useEffect, Suspense, lazy } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainNav from '@/components/siteNavigation/MainNav';
import PageLoading from '@/components/Loading/PageLoading';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import Footer from '@/components/Footer/Footer';
import { getCategories } from '@/redux/slices/categorySlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import LineLoading from '@/components/Loading/LineLoading';
import FashionLoading from '@/components/Loading/FashionLoading';
import FocusLoading from '@/components/Loading/FocusLoading';
import { fetchCart } from '@/redux/slices/cartSlice';
import { fetchWishes } from '@/redux/slices/wishlistSlice';
import { getUserToken } from '@/redux/hooks/selectors';
import { setAuthToken } from '@/redux/slices/userSlice';
import { ToastContainer } from 'react-toastify';
import AdsListing from '@/components/products/adsListing';

const FeaturedListing = lazy(
  () => import('@/components/products/FeaturedListing')
);
const BestDeals = lazy(() => import('@/components/products/BestDeals'));
const LineListing = lazy(() => import('@/components/products/LineListing'));
const FocusListing = lazy(() => import('@/components/products/FocusListing'));
const FashionListing = lazy(
  () => import('@/components/products/FashionListing')
);

enum Section {
  BONUS = 'bonus',
  FURNITURES = 'furnitures',
  COMPUTERS = 'computers',
  FASHION = 'fashion',
  PHONES = 'phones',
  ADS = 'ads',
  CARS = 'cars',
  MOTORCYCLES = 'motocyles'
}

const HomeContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', `"${token}"`);
      window.location.href = '/';
    }
  }, [token, router]);
  const { categoriesLoading, categoriesData, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (categoriesData === null && !categoriesLoading && error === null) {
        dispatch(getCategories());
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [router, dispatch, categoriesData, categoriesLoading, error]);

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
          const token = tokenString;
          dispatch(setAuthToken(token));
        } catch (error) {
          console.error('Failed to parse token from localStorage', error);
        }
      }
    }
  }, [dispatch]);

  return (
    <main className="flex min-h-screen flex-col items-center relative">
      <MainNav />
      <Suspense fallback={<PageLoading />}>
        <FeaturedListing />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <BestDeals />
      </Suspense>
      <Suspense fallback={<LineLoading title="Top Deals" bgColor={150} />}>
        <LineListing title="Top Deals" bgColor={150} section={Section.BONUS} />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <FocusListing title="cars" bgColor={100} section={Section.CARS} />
      </Suspense>
      <Suspense fallback={<LineLoading title="Computers" bgColor={150} />}>
        <LineListing
          title="Computers"
          bgColor={150}
          section={Section.COMPUTERS}
        />
      </Suspense>
      <Suspense fallback={<FashionLoading title="Fashion" bgColor={100} />}>
        <FashionListing
          title="Fashion"
          bgColor={100}
          section={Section.FASHION}
        />
      </Suspense>
      <Suspense fallback={<FocusLoading title="Phones" bgColor={150} />}>
        <FocusListing title="Phones" bgColor={150} section={Section.PHONES} />
      </Suspense>
      {/* <Suspense fallback={<LineLoading title="ali express" bgColor={150} />}>
        <AdsListing title="Aliexpress" bgColor={100} section={Section.ADS} />
      </Suspense> */}
      <Footer />
      <ToastContainer />
    </main>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeContent />
    </Suspense>
  );
}
