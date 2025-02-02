import React from 'react';
import type { Metadata } from 'next';
import { SlUserFollow } from 'react-icons/sl';
import Link from 'next/link';
import { IoArrowBackCircleOutline } from 'react-icons/io5';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Auth'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-screen flex items-center overflow-hidden fixed">
      <div className="xs:w-full md:w-1/2 h-full angled-right flex flex-col items-center justify-center relative">
        <Link
          href="/"
          className="text-sm font-bold cursor-pointer border mt-4 lg:mt-0 px-2 py-1 text-main-400 flex items-center justify-between gap-4 rounded-md absolute top-2 left-2"
        >
          <span className="flex">
            <IoArrowBackCircleOutline size={24} />
          </span>
          <span className="hidden lg:block">BACK</span>
        </Link>
        {children}
      </div>
      <div className="hidden md:flex lg:flex md:w-1/2 h-full bg-main-300 angled-left items-center justify-center"></div>
      <div className="hidden md:w-1/2 h-2/3 z-50 absolute right-0 top-1/3 text-main-100 md:flex justify-center animate__animated animate__fadeIn">
        <SlUserFollow size={400} />
      </div>
    </div>
  );
}
