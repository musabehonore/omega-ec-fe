'use client';

import React, { useEffect, useState } from 'react';
import {
  getProductDetails,
  getProductsByCategory
} from '@/redux/slices/ProductSlice';
import Image from 'next/image';
import { FaCartPlus } from 'react-icons/fa';
import { Button, ButtonSize, ButtonStyle } from '../formElements';
import { GetStars } from '../reviews/GetStars';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import Link from 'next/link';
import { GrFormNext } from 'react-icons/gr';
import FashionLoading from '../Loading/FashionLoading';
import { getCategoriesData } from '@/redux/hooks/selectors';
import { useRouter } from 'next/navigation';

export enum Section {
  BONUS = 'bonus',
  FURNITURES = 'furnitures',
  COMPUTERS = 'computers',
  FASHION = 'fashion',
  PHONES = 'phones',
  ADS = 'ads',
  CARS = 'cars',
  MOTORCYCLES = 'motocyles'
}

interface FashionListingProps {
  title: string;
  section: Section;
  bgColor: number;
}

const FashionListing: React.FC<FashionListingProps> = ({
  title,
  section,
  bgColor
}) => {
  const [category, setCategory] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const categoriesData = useAppSelector(getCategoriesData);

  const { Grouped } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (categoriesData && Grouped && !Grouped[section]) {
        const categoryId = categoriesData.find(category =>
          category.name.toLowerCase().includes(section.toLowerCase())
        )?.id;

        if (categoryId) {
          setCategory(categoryId);
          const query = {
            section,
            categoryId
          };

          dispatch(getProductsByCategory(query));
        }
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [categoriesData, Grouped, section, dispatch]);

  const GroupedProducts = useSelector(
    (state: RootState) => state.products.Grouped[section]
  );

  const products = GroupedProducts?.data || [];

  if (products?.length == 0 && !GroupedProducts?.loading) {
    return <></>;
  }

  if (products?.length == 0 && GroupedProducts?.loading) {
    return <FashionLoading title={title} bgColor={bgColor} />;
  }

  const handleProductClick = async (id: string) => {
    setLoading(true);

    await router.push(`/products/details?productId=${id}`);
  };

  if (loading) {
    return <FashionLoading title={title} bgColor={bgColor} />;
  }

  return (
    <div
      className={`flex flex-col justify-between  min-w-screen w-full p-2 md:p-6 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min mb-4 -pl-3">
        <span className="title">{title}</span>
      </div>

      <div
        className={`w-full grid justify-center gap-2 xl:gap-6 px-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-2 xl:px-6`}
      >
        {products &&
          products.slice(0, 8).map((product, index) => (
            <div
              className="relative w-full flex flex-col overflow-hidden border border-main-100 bg-white hover:shadow-md cursor-pointer rounded-xl shadow-sm min-w-72 max-w-72"
              key={index + 200}
            >
              <div
                onClick={() => handleProductClick(product.id)}
                className={`overflow-hidden aspect-w-1 aspect-h-1 h-120 flex flex-col items-center justify-between relative`}
              >
                <div className="h-4/5 relative overflow-hidden w-full flex justify-center items-center">
                  <Image
                    src={product.images[0]}
                    alt="Product image"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-contain transition-all duration-300 hover:scale-125 animate__animated animate__faster animate__fadeIn"
                  />
                </div>

                <div className="h-min gap-1 w-full p-4">
                  <div className="flex justify-between w-full items-center">
                    <p className="font-bold text-xs uppercase truncate">
                      {product.name}
                    </p>
                    <p className="font-thin text-xs"></p>
                  </div>
                  <div>
                    <GetStars rating={product.averageRatings || 0} />
                  </div>
                  <span className="font-black text-lg text-main-400 flex items-center gap-2">
                    ${' '}
                    {product.bonus
                      ? product.price.toLocaleString()
                      : product.price.toLocaleString()}
                    {product.bonus && (
                      <p className="font-thin text-xm line-through">
                        $
                        {(
                          (product.price / (100 - parseInt(product.bonus))) *
                          100
                        ).toLocaleString()}
                      </p>
                    )}
                  </span>

                  <Button
                    label="BUY NOW"
                    loading={false}
                    style={ButtonStyle.LIGHT}
                    disabled={false}
                    size={ButtonSize.SMALL}
                    icon={FaCartPlus}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <Link
        href={`/products?categoryId=${category}`}
        className="mt-6 text-center w-max self-center text-sm text-main-300 flex gap-0 transition-all ease-in-out items-center justify-center hover:text-main-400 hover:gap-2 hover:font-semibold"
      >
        show more
        <GrFormNext />
      </Link>
    </div>
  );
};

export default FashionListing;
