import React from 'react';
import type { Metadata } from 'next';
import ProductNav from '@/components/siteNavigation/ProductsNav';
import ProductsSideNav from '@/components/siteNavigation/ProductsSideNav';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'products',
  description: 'products'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="gap-0 flex-col relative">
      <div className="flex flex-col justify-between mt-16 gap-4 min-w-screen p-0 w-full z-0">
        {children}
      </div>
      <Footer />
    </div>
  );
}
