'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '@/redux/slices/ProductSlice';
import Image from 'next/image';
import { FaCartPlus } from 'react-icons/fa';
import { Button, ButtonStyle, ButtonSize } from '../formElements';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { GetStars } from '../reviews/GetStars';
import Link from 'next/link';
import { GrFormNext } from 'react-icons/gr';
import FocusLoading from '../Loading/FocusLoading';
import { Section } from './FashionListing';
import { getCategoriesData } from '@/redux/hooks/selectors';

interface FocusListingProps {
  title: string;
  section: Section;
  bgColor: number;
}

const FocusListing: React.FC<FocusListingProps> = ({
  title,
  section,
  bgColor
}) => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<string>('');
  const [index, setIndex] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState('');

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

  useEffect(() => {
    if (products) {
      const timer = setTimeout(() => {
        setAnimationClass('');

        setTimeout(() => {
          const nextIndex = (index + 1) % Math.min(products.length, 9);
          setIndex(nextIndex);
          setAnimationClass(
            'animate__animated animate__fadeInRight animate__slow'
          );
        }, 100);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [index, products]);

  if (products?.length == 0 && !GroupedProducts?.loading) {
    return <></>;
  }

  if (products?.length == 0 && GroupedProducts?.loading) {
    return <FocusLoading title={title} bgColor={bgColor} />;
  }

  return (
    <div
      className={`flex flex-col justify-between  min-w-screen w-full pl-2 py-4 px-12 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min p-2 ">
        <span className="title">{title}</span>
      </div>

      <div className="w-full justify-between p-1 rounded-lg flex gap-4 relative">
        <div
          className={`hidden xl:block min-h-full my-auto xl:w-1/2 relative gap-2 overflow-hidden flex-col justify-center`}
        >
          {products && products[index]?.images[0] && (
            <div
              className={`overflow-hidden aspect-w-1 aspect-h-1 h-auto flex flex-col items-center justify-between relative lg:px-0 xl:px-6 `}
            >
              <div
                className={`w-full h-120 overflow-hidden relative bg-white ${animationClass}`}
              >
                <Image
                  src={products[index].images[0]}
                  alt="Product image"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-all duration-300 hover:scale-125 animate__animated animate__faster animate__fadeIn"
                />
              </div>
              <div
                className={`h-min gap-1 w-full text-center p-4  ${animationClass}`}
              >
                <div className="flex justify-between w-full items-center">
                  <p className="font-bold text-xs uppercase truncate">
                    {products[index].name}
                  </p>
                  <p className="font-thin text-xs"></p>
                </div>
                <div>
                  <GetStars rating={products[index].averageRatings || 0} />
                </div>
                <span className="font-black text-lg text-main-400 flex items-center gap-2">
                  ${' '}
                  {products[index].bonus
                    ? (
                        products[index].price -
                        (products[index].price *
                          parseInt(products[index].bonus)) /
                          100
                      ).toLocaleString()
                    : products[index].price.toLocaleString()}
                  {products[index].bonus && (
                    <p className="font-thin text-sm line-through">
                      $ {products[index].price.toLocaleString()}
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
          )}
        </div>
        <div
          className={`w-full xl:w-1/2 grid h-max gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mb-4`}
        >
          {products &&
            products
              .slice(0, 9)
              .map((product, i) => (
                <ProductCard
                  product={product}
                  key={i + product.slug}
                  styles={`${index === i && 'xl:border xl:border-main-300'}`}
                />
              ))}
        </div>
        <Link
          href={`/products?categoryId=${category}`}
          className="absolute right-0 bottom-0 text-center w-max self-center text-sm text-main-300 flex gap-0 transition-all ease-in-out items-center justify-center hover:text-main-400 hover:gap-2 hover:font-semibold"
        >
          show more
          <GrFormNext />
        </Link>
      </div>
    </div>
  );
};

export default FocusListing;
