'use client';

import React, { useState, useEffect } from 'react';
import { FeaturedProducts } from '@/utils/assets';
import Image from 'next/image';
import { Button, ButtonStyle } from '../formElements';
import { FaCartPlus } from 'react-icons/fa';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks/hook';
import { getCategoriesData } from '@/redux/hooks/selectors';

interface FeaturedListingProps {}

const FeaturedListing: React.FC<FeaturedListingProps> = ({}) => {
  const [index, setIndex] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('');

      setTimeout(() => {
        const nextIndex = (index + 1) % FeaturedProducts.length;
        setIndex(nextIndex);
        setAnimationClass(
          'animate__animated animate__fadeInRight animate__slow'
        );
      }, 100);
    }, 8000);

    return () => clearTimeout(timer);
  }, [index]);

  const categoriesData = useAppSelector(getCategoriesData);

  const getCategoryId = (name: string) => {
    if (categoriesData === null) return '';

    return (
      categoriesData.find(category =>
        category.name.toLowerCase().includes(name.toLowerCase())
      )?.id || ''
    );
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-center pt-96 md:pt-0 gap-4 bg-main-100 md:justify-between md:gap-2 min-h-screen min-w-screen w-full pl-2 overflow-hidden`}
    >
      <div
        className={`flex  order-2 md:order-1 gap-2 justify-center w-full md:w-1/2  md:min-h-full p-2 items-start flex-col px-4 md:px-6  ${animationClass}`}
      >
        <h2 className="text-4xl md:text-5xl">
          {FeaturedProducts[index].title}
        </h2>
        <span className="text-sm w-3/4">
          {FeaturedProducts[index].description}
        </span>
        <Link
          href={`/products?categoryId=${getCategoryId(FeaturedProducts[index].category)}`}
        >
          <Button
            label="VIEW MORE"
            loading={false}
            style={ButtonStyle.LIGHT}
            disabled={false}
            icon={FaCartPlus}
          />
        </Link>
      </div>

      <div className="w-full order-1 md:order-2 md:w-1/2 md:min-h-full p-1 relative">
        <div className="w-1/2 h-120 gradient absolute bottom-40 right-0"></div>
        <div
          className={`w-full absolute right-0 md:right-6 bottom-0 h-52 sm:h-80 md:h-120 z-20 overflow-hidden ${animationClass}`}
        >
          <Image
            src={FeaturedProducts[index].image}
            alt="Product image"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain transition-all duration-300 animate__animated animate__faster animate__fadeIn"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedListing;
