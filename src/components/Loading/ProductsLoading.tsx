'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import LoadingCard from './LoadingCard';
import { useSearchParams } from 'next/navigation';
import { HiOutlineHome } from 'react-icons/hi2';

interface ProductLoadingProps {}

const ProductLoading: React.FC<ProductLoadingProps> = () => {
  const searchParams = useSearchParams();
  const limit = parseInt(searchParams.get('limit') || '50');
  return (
    <>
      <div className="flex justify-between m-0 gap-4 min-w-screen p-0 w-full z-0">
        <section className="sm:py-4 w-full pt-0 flex flex-col gap-2 ">
          <div className=" flex justify-between w-full h-min -mt-1 py-1 -ml-4 px-4 fixed z-40 bg-main-100">
            <h2 className="text-base font-bold flex gap-2 items-center">
              <HiOutlineHome
                size={24}
                className="hover:underline cursor-pointer text-sm hover:bg-text-main-300"
              />
              <span>Products</span>
            </h2>
          </div>

          <div className=" w-full p-1 rounded-lg overflow-y-auto mt-10">
            <div className="w-full grid auto-fit-grid gap-3 rounded-xl overflow-y-auto">
              {Array.from({ length: limit }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          </div>
        </section>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductLoading;
