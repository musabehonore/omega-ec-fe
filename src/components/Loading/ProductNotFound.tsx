'use client';

import React from 'react';

interface NotFound {}

const NotFound: React.FC<NotFound> = () => {
  return (
    <article className="relative w-full flex flex-col overflow-hidden border border-main-100 hover:shadow-md cursor-pointer bg-main-150 opacity-50 rounded-xl shadow-sm animate__animated animate__faster animate__fadeIn">
      <div className="w-full">
        <div className="overflow-hidden aspect-w-1 aspect-h-1 h-72 flex flex-col items-center justify-center relative text-xl font-semibold">
          Not found !
        </div>
      </div>
    </article>
  );
};

export default NotFound;
