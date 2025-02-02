'use client';

import React, { useEffect, useRef } from 'react';
import { getProductsByCategory } from '@/redux/slices/ProductSlice';
import { getCategories } from '@/redux/slices/categorySlice';
import { useAppDispatch } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import LoadingCard from '../Loading/LoadingCard';

interface LineLoadingProps {
  title: string;
  bgColor: number;
}

const LineLoading: React.FC<LineLoadingProps> = ({ title, bgColor }) => {
  return (
    <div
      className={`flex flex-col justify-between min-w-screen w-full pl-2 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min p-2">
        <span className="title">{title}</span>
      </div>

      <div className="w-full p-1 rounded-lg overflow-x-auto relative scroll-container">
        <div className="w-full flex justify-start gap-4 overflow-x-auto first-line:min-w-full relative">
          {Array.from({ length: 10 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineLoading;
