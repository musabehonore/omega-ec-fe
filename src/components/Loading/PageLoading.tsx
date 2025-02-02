'use client';

import React from 'react';
import { ScaleLoader } from 'react-spinners';

const PageLoading: React.FC = () => {
  return (
    <div className="mt-1/2 flex flex-col min-w-screen mx-auto gap-4  items-center justify-center min-h-screen bg-main-100 ">
      <ScaleLoader color="#2C3333" />
      <span className="text-lg font-semibold animate__animated animate__fadeIn animate__faster infinite w-min">
        Loading...
      </span>
    </div>
  );
};

export default PageLoading;
