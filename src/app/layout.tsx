/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';
import { Metadata } from 'next';
import React from 'react';
import { Suspense } from 'react';
import Providers from '@/redux/provider';
import 'animate.css';
import PageLoading from '@/components/Loading/PageLoading';

export const metadata: Metadata = {
  title: 'Alpha',
  description: 'Alpha'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col justify-between min-w-screen bg-main-100 text-main-400 h-auto relative px-0">
            <Suspense fallback={<PageLoading />}>{children}</Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
