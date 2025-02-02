'use client';

import React from 'react';
import { PuffLoader } from 'react-spinners';

interface FashionLoadingProps {
  title: string;
  bgColor: number;
}

const FashionLoading: React.FC<FashionLoadingProps> = ({ title, bgColor }) => {
  return (
    <div
      className={`flex flex-col justify-between  min-w-screen w-full p-6 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min mb-4 -pl-3">
        <span className="title">{title}</span>
      </div>

      <div
        className={`w-full grid gap-6 lg:grid-cols-3 xl:grid-cols-4 lg:px-2 xl:px-6`}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="relative w-full flex flex-col overflow-hidden border border-main-100 bg-white hover:shadow-md cursor-pointer rounded-xl shadow-sm min-w-72 max-w-72"
            key={index}
          >
            <div
              className={`overflow-hidden aspect-w-1 aspect-h-1 h-120 flex flex-col items-center justify-between relative`}
            >
              <div className="h-4/5 relative overflow-hidden w-full flex justify-center items-center">
                <PuffLoader color="#2C3333" size={80} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionLoading;
