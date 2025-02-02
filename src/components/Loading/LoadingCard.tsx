'use client';

import React from 'react';
import { PuffLoader } from 'react-spinners';

interface LoadingCard {}

const LoadingCard: React.FC<LoadingCard> = () => {
  return (
    <article className="relative w-full flex flex-col overflow-hidden border border-main-100 hover:shadow-md cursor-pointer bg-white opacity-50 rounded-xl shadow-sm animate__animated animate__faster animate__fadeIn min-w-52 max-w-60">
      <div className="w-full">
        <div className="overflow-hidden aspect-w-1 aspect-h-1 h-72 flex flex-col items-center justify-center relative">
          <PuffLoader color="#2C3333" size={80} />
        </div>
      </div>
    </article>
  );
};

export default LoadingCard;
