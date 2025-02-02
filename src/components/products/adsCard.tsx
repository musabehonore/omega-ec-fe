import React from 'react';
import Image from 'next/image';

interface ItemAttributes {
  itemId: number;
  title: string;
  sales: number;
  image: string;
  sku: {
    def: {
      price: number | null;
      promotionPrice: number;
      prices: {
        pc: number;
        app: number;
      };
    };
  };
  averageStarRate: number | null;
}

interface DeliveryAttributes {
  freeShipping: boolean;
  shippingFee: number | null;
  shippingDisplay: string;
}

interface AdAttributes {
  item: ItemAttributes;
  delivery: DeliveryAttributes;
}

interface AdCardProps {
  ad: AdAttributes;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { item } = ad;
  const { title, image, sku, averageStarRate } = item;

  const calculateDiscountedPrice = (price: number) =>
    (price + price * 0.1).toFixed(2);

  const handleClick = () => {
    window.open('https://www.aliexpress.com', '_blank');
  };

  return (
    <div
      className="border-gray-200 rounded-lg shadow-lg p-0 bg-white w-60 mx-0 my-0 relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-40 relative overflow-hidden w-full flex justify-center items-center">
        <Image
          src={`https:${image}`}
          alt="Product image"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-all duration-300 hover:scale-125"
        />
        <div className="absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1">
          -10%
        </div>
      </div>
      <h3 className=" text-sm font-semibold mt-4 text-center ml-3 truncate">
        {title}
      </h3>
      <div className="flex justify-start mt-2 ml-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < (averageStarRate || 0) ? 'text-yellow-500' : 'text-[#e5eded]'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <div className="mt-2 ml-3 text-center flex gap-3 mb-3">
        <span className="text-xl font-bold">
          ${sku.def.promotionPrice.toFixed(2)}
        </span>
        <span className="text-sm line-through ml-2 mt-[4px]">
          ${calculateDiscountedPrice(sku.def.promotionPrice)}
        </span>
      </div>
    </div>
  );
};

export default AdCard;
