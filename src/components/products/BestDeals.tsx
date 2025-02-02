'use client';

import React from 'react';
import Image from 'next/image';
import { Button, ButtonSize, ButtonStyle } from '../formElements';
import { FaCartPlus, FaCircle } from 'react-icons/fa';
import { FeaturedProducts } from '@/utils/assets';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks/hook';
import { getCategoriesData } from '@/redux/hooks/selectors';

interface BestDealsProps {}

const BestDeals: React.FC<BestDealsProps> = () => {
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
    <div className="flex justify-between gap-3 min-h-screen min-w-screen w-full pl-3 bg-main-100 mb-3 border-t">
      <div className=" hidden xl:flex gap-2 justify-start xl:w-1/5 min-h-full p-2 items-start flex-col px-6 bg-white">
        <div className="border-b text-main-400 uppercase w-full p-2 -m-2 mb-2">
          All Categories
        </div>
        <ul className="flex flex-col text-xs sm:text-sm md:text-md font-light gap-2 ">
          {categoriesData &&
            categoriesData.slice(0, 5).map((itm, index) => (
              <Link
                href={`/products?categoryId=${itm.id}`}
                className="flex items-center gap-2 hover:underline cursor:pointer"
                key={index}
              >
                <FaCircle />
                {itm.name}
              </Link>
            ))}
        </ul>
      </div>
      <div className="w-full xl:w-4/5 min-h-full relative grid grid-cols-3 grid-rows-4 gap-3 pr-3">
        <div className="bg-main-400 col-span-3 row-span-2 relative overflow-hidden">
          <div className="flex gap-2 justify-center w-full md:w-1/2 min-h-full p-2 items-start flex-col px-2 sm:px-4 md:px-6 text-white">
            <h2 className="text-2xl font-semibold truncate">
              {FeaturedProducts[0].title}
            </h2>
            <span className="text-sm w-full">
              {FeaturedProducts[0].description}
            </span>
            <Link
              href={`/products?categoryId=${getCategoryId(FeaturedProducts[0].category)}`}
            >
              <Button
                label="MORE"
                loading={false}
                style={ButtonStyle.DARK}
                size={ButtonSize.SMALL}
                disabled={false}
                icon={FaCartPlus}
              />
            </Link>
          </div>
          <div className="hidden md:block bottom-0 md:w-1/2 md:absolute md:right-6 md:bottom-0 min-h-full z-20 overflow-hidden">
            <Image
              src={FeaturedProducts[0].image}
              alt="Product image"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain transition-all duration-300 animate__animated animate__faster animate__fadeIn"
            />
          </div>
        </div>
        <div className="bg-white col-span-3 lg:col-span-2 row-span-1 rounded-md relative p-2 items-center">
          <div className="flex gap-2 justify-center w-full md:w-1/2 min-h-full p-2 items-start flex-col px-2 sm:px-4 md:px-6 overflow-hidden text-main-400">
            <h2 className="text-2xl font-semibold truncate">
              {FeaturedProducts[1].title}
            </h2>
            <span className="text-sm w-full">
              {FeaturedProducts[1].description}
            </span>
            <Link
              href={`/products?categoryId=${getCategoryId(FeaturedProducts[1].category)}`}
            >
              <Button
                label="MORE"
                loading={false}
                style={ButtonStyle.LIGHT}
                size={ButtonSize.SMALL}
                disabled={false}
                icon={FaCartPlus}
              />
            </Link>
          </div>
          <div className="hidden md:block md:w-1/3 absolute right-6 bottom-0 min-h-full z-20 overflow-hidden">
            <Image
              src={FeaturedProducts[1].image}
              alt="Product image"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain transition-all duration-300 animate__animated animate__faster animate__fadeIn"
            />
          </div>
        </div>
        <div className="bg-main-200 hidden lg:flex lg:flex-col gap-4 col-start-3 row-span-2 rounded-md relative">
          <div className="flex gap-2 justify-center w-full min-h-max pt-4 items-start flex-col px-2 sm:px-4 md:px-6 text-main-400">
            <h2 className="text-2xl font-semibold truncate">
              {FeaturedProducts[2].title}
            </h2>
            <span className="text-sm ">{FeaturedProducts[2].description}</span>
            <Link
              href={`/products?categoryId=${getCategoryId(FeaturedProducts[2].category)}`}
            >
              <Button
                label="MORE"
                loading={false}
                style={ButtonStyle.LIGHT}
                size={ButtonSize.SMALL}
                disabled={false}
                icon={FaCartPlus}
              />
            </Link>
          </div>
          <div className="w-full relative left-0 bottom-0 min-h-60 z-20 overflow-hidden">
            <Image
              src={FeaturedProducts[2].image}
              alt="Product image"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain transition-all duration-300 animate__animated animate__faster animate__fadeIn"
            />
          </div>
        </div>
        <div className="bg-main-150 col-span-3 lg:col-span-2 row-span-1 rounded-md relative">
          <div className="hidden md:block md:w-1/3 absolute left-0 md:left-6 bottom-0 min-h-full z-20 overflow-hidden">
            <Image
              src={FeaturedProducts[3].image}
              alt="Product image"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain transition-all duration-300 animate__animated animate__faster animate__fadeIn"
            />
          </div>
          <div className="flex gap-2 overflow-hidden absolute md:right-6 justify-center w-full md:w-1/2 min-h-full p-2 items-start flex-col px-2 sm:px-4 md:px-6 text-main-400">
            <h2 className="text-2xl font-semibold ">
              {FeaturedProducts[3].title}
            </h2>
            <span className="text-sm w-full">
              {FeaturedProducts[3].description}
            </span>
            <Link
              href={`/products?categoryId=${getCategoryId(FeaturedProducts[3].category)}`}
            >
              <Button
                label="MORE"
                loading={false}
                style={ButtonStyle.LIGHT}
                size={ButtonSize.SMALL}
                disabled={false}
                icon={FaCartPlus}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
