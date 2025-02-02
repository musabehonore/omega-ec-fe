'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

interface SliderProps {
  images: string[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [image, setImage] = useState<string | null>('');

  const [animationClass, setAnimationClass] = useState('');

  const handleImageChange = (index: number) => {
    setAnimationClass('');
    if (selectedImage == index) {
      return;
    }
    setTimeout(() => {
      setImage(images[index]);
      if (selectedImage > index) {
        setSelectedImage(index);
        setAnimationClass(
          'animate__animated animate__fadeInLeft animate__faster'
        );
      } else {
        setSelectedImage(index);
        setAnimationClass(
          'animate__animated animate__fadeInRight animate__faster'
        );
      }
    }, 100);
  };

  const handleNext = () => {
    if (images.length - 1 == selectedImage) {
      handleImageChange(0);
    } else {
      handleImageChange(selectedImage + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedImage == 0) {
      handleImageChange(images.length - 1);
    } else {
      handleImageChange(selectedImage - 1);
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      setImage(images[0]);
      setSelectedImage(0);
    }
  }, [images]);

  return (
    <>
      <div className="overflow-hidden rounded-xl h-80 sm:h-96 md:h-150 bg-white cursor-pointer aspect-w-1 aspect-h-1  flex flex-col items-center justify-between relative animate__animated animate__faster animate__fadeIn">
        <div
          onClick={handlePrevious}
          className="absolute border rounded-full border-main-400 left-2 top-1/2 transform -translate-y-1/2 text-main-300 opacity-30 hover:opacity-95 hover:bg-main-300 z-20 hover:text-main-100"
        >
          <GrFormPrevious size={42} />
        </div>
        {image ? (
          <div className="w-full h-full relative flex justify-center items-center">
            <Image
              src={image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              alt="Product image"
              className={` mx-auto object-contain transition-all cursor:pointer duration-300 hover:scale-125 ${animationClass} z-0`}
            />
          </div>
        ) : (
          <></>
        )}

        <div
          onClick={handleNext}
          className="absolute border rounded-full border-main-400 right-2 top-1/2 transform -translate-y-1/2  text-main-300 opacity-30 hover:opacity-95 hover:bg-main-300 z-20 hover:text-main-100"
        >
          <GrFormNext size={42} />
        </div>
      </div>
      <div className="max-w-full h-16 overflow-x-scroll w-max md:h-20 flex gap-2 mt-2 mx-auto scroll-container">
        {images.map((img, index) => (
          <div
            onClick={() => {
              handleImageChange(index);
            }}
            key={index}
            className={`overflow-hidden min-w-20 cursor-pointer aspect-w-1 aspect-h-1 h-full flex flex-col items-center justify-between ${index == selectedImage ? 'border' : ''}`}
          >
            <Image
              width={400}
              height={400}
              src={img}
              alt="Product image"
              className="h-full w-auto object-cover transition-all cursor:pointer duration-300 hover:scale-125 animate__animated animate__faster animate__fadeIn"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Slider;
