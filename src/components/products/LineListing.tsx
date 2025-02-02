'use client';

import React, { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '@/redux/slices/ProductSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import LoadingCard from '../Loading/LoadingCard';
import LineLoading from '../Loading/LineLoading';
import { Section } from './FashionListing';
import { getCategoriesData } from '@/redux/hooks/selectors';

interface LineListingProps {
  title: string;
  section: Section;
  bgColor: number;
}

const LineListing: React.FC<LineListingProps> = ({
  title,
  section,
  bgColor
}) => {
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const categoriesData = useAppSelector(getCategoriesData);

  const { Grouped } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!Grouped[section] && section === Section.BONUS) {
        const query = {
          section,
          sort: { bonus: 'DESC' }
        };
        dispatch(getProductsByCategory(query));
      } else if (categoriesData && Grouped && !Grouped[section]) {
        const categoryId = categoriesData.find(category =>
          category.name.toLowerCase().includes(section.toLowerCase())
        )?.id;

        if (categoryId) {
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
    const continuousScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      }
    };

    const scrollInterval = setInterval(continuousScroll, 30);

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  // const handleScrollNext = () => {
  //   const scrollContainer = scrollContainerRef.current;
  //   if (scrollContainer) {
  //     scrollContainer.scrollLeft += scrollContainer.clientWidth;
  //   }
  // };

  // const handleScrollPrevious = () => {
  //   const scrollContainer = scrollContainerRef.current;
  //   if (scrollContainer) {
  //     scrollContainer.scrollLeft -= scrollContainer.clientWidth;
  //   }
  // };

  if (products?.length == 0 && !GroupedProducts?.loading) {
    return <></>;
  }

  if (products?.length == 0 && GroupedProducts?.loading) {
    return <LineLoading title={title} bgColor={bgColor} />;
  }

  return (
    <div
      className={`flex flex-col justify-between min-w-screen w-full pl-2 bg-main-${bgColor}`}
    >
      <div className="flex justify-between w-full h-min p-2">
        <span className="title">{title}</span>
      </div>

      <div
        className="w-full p-1 rounded-lg overflow-x-auto relative scroll-container"
        ref={scrollContainerRef}
      >
        {GroupedProducts.loading ? (
          <div className="w-full flex justify-start gap-4 overflow-x-auto first-line:min-w-full relative scroll-container">
            {Array.from({ length: 10 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-start gap-4 overflow-x-auto first-line:min-w-full relative scroll-container">
            {products.map((product, index) => (
              <ProductCard product={product} key={index + 10} />
            ))}
          </div>
        )}
        {/* <div
          onClick={handleScrollPrevious}
          className="absolute border-2 z-40 rounded-full bg-main-100 border-main-400 left-2 top-1/2 transform -translate-y-1/2 text-main-400 opacity-50 cursor-pointer hover:opacity-95 hover:bg-main-300 hover:text-main-100"
        >
          <GrFormPrevious size={42} />
        </div>
        <div
          onClick={handleScrollNext}
          className="absolute border-2 z-40 rounded-full bg-main-100 border-main-400 right-2 top-1/2 transform -translate-y-1/2 text-main-400 opacity-50 cursor-pointer hover:opacity-95 hover:bg-main-300 hover:text-main-100"
        >
          <GrFormNext size={42} />
        </div> */}
      </div>
    </div>
  );
};

export default LineListing;
