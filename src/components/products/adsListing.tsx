'use client';

import React, { useEffect, useRef, useState } from 'react';
import AdCard from './adsCard';
import { getAds } from '@/redux/slices/adsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { getAdsData } from '@/redux/hooks/selectors';
import LoadingCard from '../Loading/LoadingCard';
import LineLoading from '../Loading/LineLoading';
import { Section } from './FashionListing';

interface LineListingProps {
  title: string;
  section: Section;
  bgColor: number;
}

const AdsListing: React.FC<LineListingProps> = ({ title, bgColor }) => {
  const dispatch = useAppDispatch();
  const { error, adsData, adsLoading } = useAppSelector(getAdsData);

  useEffect(() => {
    if (error === null && adsData === null) {
      dispatch(getAds());
    }
  }, [error, adsData, dispatch]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    const continuousScroll = () => {
      const scrollContainer = scrollContainerRef.current;

      if (scrollContainer && isScrolling) {
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
  }, [isScrolling]);

  const handleMouseEnter = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(true);
  };

  if (adsLoading) {
    return <LineLoading title={title} bgColor={bgColor} />;
  }

  if (!adsData && !adsLoading) {
    return <></>;
  }

  return (
    <div
      className={`flex flex-col justify-between min-w-screen w-full pl-2 bg-main-100`}
    >
      <div className="flex justify-between w-full h-min p-2">
        <span className="title">{title}</span>
      </div>

      <div
        className="w-full p-1 rounded-lg overflow-x-auto relative scrollbar-hide"
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!adsData ? (
          <div className="w-full flex justify-start gap-4 overflow-x-auto first-line:min-w-full relative">
            {Array.from({ length: 10 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-start gap-4 overflow-x-auto first-line:min-w-full relative scroll-container">
            {adsData &&
              adsData?.map((ad, index) => <AdCard ad={ad} key={index} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsListing;
