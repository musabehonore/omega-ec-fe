'use client';

import React from 'react';
import SideNav from '../../components/dashboard/SideNav';
import TopNav from '@/components/dashboard/TopNav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-shrink-0">
      <div className="hidden sm:block">
        <SideNav />
      </div>
      <div className="flex flex-col w-full">
        <TopNav />
        <main className="flex-1 bg-white overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
