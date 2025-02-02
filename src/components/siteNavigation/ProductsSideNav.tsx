'use client';

import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { SellerInterface, getProducts } from '@/redux/slices/ProductSlice';
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import Filters from './Filter';
import { getCategoriesData } from '@/redux/hooks/selectors';
import {
  CategoryAttributes,
  getCategories
} from '@/redux/slices/categorySlice';
import { useRouter } from 'next/navigation';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { IoMenuOutline } from 'react-icons/io5';

export interface FiltersInterface {
  max: number | null;
  min: number | null;
  seller: SellerInterface | null;
}

const initialCategory: CategoryAttributes = {
  id: '',
  name: 'All categories',
  description: 'All categories'
};

const ProductsSideNav: FC = () => {
  const { showSideNav } = useAppSelector((state: RootState) => state.products);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryAttributes>(initialCategory);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const categoriesData = useAppSelector(getCategoriesData);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const categoryId = currentParams.get('categoryId');
    if (categoriesData && categoryId) {
      const selectedCategory = categoriesData.find(
        category => category.id.toLowerCase() === categoryId.toLowerCase()
      );

      if (selectedCategory) {
        setSelectedCategory(selectedCategory);
      }
    }
  }, [categoriesData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentParams = new URLSearchParams(window.location.search);
      const newParams = new URLSearchParams();
      currentParams.forEach((value, key) => newParams.append(key, value));

      if (selectedCategory !== initialCategory) {
        newParams.set('categoryId', selectedCategory.id);
      } else if (currentParams.get('categoryId') === '') {
        newParams.delete('categoryId');
      }

      const queryString = newParams.toString();
      const queryParamsObject: Record<string, string> = {};
      newParams.forEach((value, key) => {
        queryParamsObject[key] = value;
      });

      router.push(`?${queryString}`);
      dispatch(getProducts(queryParamsObject));
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (categoriesData === null) {
        dispatch(getCategories());
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [dispatch, categoriesData]);

  return (
    <div
      className={`min-h-screen px-4 pt-4 hidden relative overflow-hidden bg-main-150 lg:flex flex-col ${showSideNav ? 'lg:max-w-min lg:min-w-72' : 'hidden lg:hidden'}  `}
    >
      <div className="bg-main-150">
        <div
          className="hidden mt-4 uppercase min-w-56 relative text-xs font-bold cursor-pointer border px-4 py-1 text-main-400 lg:flex items-center justify-between  rounded-md"
          onClick={() => setShowCategories(!showCategories)}
          onMouseOver={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          <span className="flex">
            <IoMenuOutline />
          </span>
          {selectedCategory.name}
          {showCategories ? <FaAngleUp /> : <FaAngleDown />}

          {showCategories && (
            <div className="min-h-screen min-w-full z-30 absolute left-0 top-7 overflow-y-hidden">
              <ul className="bg-main-100 border border-t-0 shadow-sm min-h-screen text-left min-w-full z-30 pt-4 rounded-b-md left-0 top-7 animate__animated animate__fadeInDown animate__faster">
                <li
                  onClick={() => {
                    const currentParams = new URLSearchParams(
                      window.location.search
                    );
                    const newParams = new URLSearchParams();
                    currentParams.forEach((value, key) =>
                      newParams.append(key, value)
                    );
                    if (currentParams.get('categoryId')) {
                      newParams.delete('categoryId');
                    }

                    const queryString = newParams.toString();
                    const queryParamsObject: Record<string, string> = {};
                    newParams.forEach((value, key) => {
                      queryParamsObject[key] = value;
                    });

                    router.push(`?${queryString}`);
                    dispatch(getProducts(queryParamsObject));
                    setSelectedCategory(initialCategory);
                  }}
                  className={`w-full p-1 px-4 border-x-transparent  ${selectedCategory === initialCategory ? 'border font-bold' : ''} hover:bg-main-200  uppercase`}
                >
                  All
                </li>
                {categoriesData &&
                  categoriesData.map(category => (
                    <li
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full p-1 px-4 border-x-transparent  ${selectedCategory === category ? 'border font-bold' : ''} hover:bg-main-200  uppercase`}
                    >
                      {category.name}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <Filters onClick={() => {}} />
      </div>
    </div>
  );
};

export default ProductsSideNav;
