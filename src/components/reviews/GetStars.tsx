import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

interface GetStarsProps {
  rating: number;
}

export const GetStars: React.FC<GetStarsProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} size={18} className="text-star" />);
    } else {
      stars.push(<FaStar key={i} size={18} className="text-main-200" />);
    }
  }

  return <span className="flex w-min gap-0.5 text-amber-400">{stars}</span>;
};
