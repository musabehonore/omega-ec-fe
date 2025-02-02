'use client';

import React from 'react';
import LoadingCard from './LoadingCard';

interface FocusLoadingProps {
  title: string;
  bgColor: number;
}

const FocusLoading: React.FC<FocusLoadingProps> = ({ title, bgColor }) => {
  return (
    <div
      className={`flex flex-col justify-between  min-w-screen w-full pl-2 py-4 px-12 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min p-2 ">
        <span className="title">{title}</span>
      </div>

      <div className="w-full justify-between p-1 rounded-lg flex gap-4 relative">
        <div className="min-h-full w-1/2 relative gap-2 overflow-hidden flex flex-col justify-center"></div>
        <div
          className={`lg:w-1/2 grid gap-3 md:grid-cols-3 lg:grid-cols-3 mb-4`}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusLoading;
