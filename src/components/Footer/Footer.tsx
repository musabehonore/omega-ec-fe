'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { getCategoriesData } from '@/redux/hooks/selectors';
import { getSellers } from '@/redux/slices/sellerSlice';
import { RootState } from '@/redux/store';
import error from 'next/error';
import React, { useEffect } from 'react';
import { FC } from 'react';
import { FaCircle, FaPhoneAlt, FaShopify } from 'react-icons/fa';
import { MdLocationPin, MdOutlineEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';

const Footer: FC = () => {
  const dispatch = useAppDispatch();

  const { data, error } = useSelector((state: RootState) => state.sellers);

  const categoriesData = useAppSelector(getCategoriesData);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (data === null && error === null) {
        dispatch(getSellers());
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [data, dispatch, error]);

  return (
    <div className="w-full flex flex-col h-full gap-4 self-end bottom-0 mt-4 bg-main-150 text-main-100 shadow-md border-t-main-400 border-t-1 z-30">
      <nav className="w-full bg-main-200 flex justify-end items-center p-1 gap-2"></nav>
      <div className="w-full sm:flex-col gap-8 p-6 md:flex md:flex-row justify-center bg-main-150 min-h-60 text-main-400 sm:gap-8 sm:p-12 md:gap-16 md:p-16 lg:gap-28 lg:p-12 ">
        <div className="flex flex-col gap-3">
          <span className="font-bold relative h-9 z-0">
            CONTACT US
            <span className="border-b-4 w-2/5 absolute left-0 bottom-0"></span>
          </span>

          <ul className="flex flex-col text-xs sm:text-sm md:text-md font-light gap-2">
            <li className="flex items-center gap-2">
              <MdLocationPin />
              Kigali, Rwanda
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt />
              (+250) 780 111 110
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineEmail />
              alphaatlpcohort29@gmail.com
            </li>
          </ul>
        </div>
        <div className="flex flex-col pt-4 md:pt-0 gap-3">
          <span className="font-bold relative h-9 uppercase">
            Top Sellers
            <span className="border-b-4 w-2/5 absolute left-0 bottom-0"></span>
          </span>

          <ul className="flex flex-col text-xs sm:text-sm md:text-md font-light gap-2">
            {data &&
              data.slice(0, 5).map((itm, index) => (
                <li
                  className="flex items-center gap-2 hover:underline cursor:pointer"
                  key={index}
                >
                  <FaShopify />
                  {itm.name}
                </li>
              ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 pt-4 md:pt-0">
          <span className="font-bold relative h-9 uppercase truncate">
            Shop by Categories
            <span className="border-b-4 w-2/5 absolute left-0 bottom-0"></span>
          </span>

          <ul className="flex flex-col text-xs sm:text-sm md:text-md font-light gap-2">
            {categoriesData &&
              categoriesData.slice(0, 5).map((itm, index) => (
                <li
                  className="flex items-center gap-2 hover:underline cursor:pointer"
                  key={index}
                >
                  <FaCircle />
                  {itm.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <nav className="w-full bg-main-200 text-xs sm:text-sm md:text-md flex justify-center text-main-400 items-center p-3 gap-2">
        © 2024 ATLP -29 Designed by TeamAlpha
      </nav>
    </div>
  );
};

export default Footer;
