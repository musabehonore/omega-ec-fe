'use client';

import React, { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProductInterface } from '@/redux/slices/ProductSlice';

interface ProductButtonProps {
  product: ProductInterface;
}

const ProductButton: React.FC<ProductButtonProps> = ({ product }) => {
  const pathName = usePathname();
  const adminView = pathName.includes('/admin/');

  return (
    <div className="p-0">
      {adminView ? (
        <div className="gap-2 flex flex-col">
          <button className="disabled:bg-opacity-60 bg-base-dark-500 h-10 text-white font-normal rounded-b-xl text-base border-b-4 border-base-yellow-500 w-full">
            Edit Item
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ProductButton;
