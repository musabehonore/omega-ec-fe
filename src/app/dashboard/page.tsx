'use client';
import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks/hook';
import Image from 'next/image';
import dashboardImage from '@/assets/images/dashboard.png';
import { RootState } from '@/redux/store';
export default function AdminPanel() {
  const { profile } = useAppSelector((state: RootState) => state.profile);
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);
  return (
    <div className="bg-[#A5C9CA] rounded-lg shadow-lg p-8 h-[50vh] w-full flex flex-col md:flex-row ">
      <div className="mb-4 md:mb-0 md:text-left md:flex-[2]">
        <h1 className="text-4xl font-bold">
          Welcome, {profile?.data?.name || ''}
        </h1>
        <p className="py-7 text-xm w-2/3">
          Alpha-Market is excited, to have you back! Explore your dashboard for
          the latest updates and features.
        </p>
      </div>
      <div className="w-full h-48 relative top-9 mt-10 md:mt-0 md:flex-[1] hidden md:block">
        <Image
          src={dashboardImage}
          alt="Welcome"
          objectFit="cover"
          className="rounded-lg w-full h-full"
        />
      </div>
    </div>
  );
}
