'use client';

import React from 'react';
import { GrFormNextLink, GrFormPreviousLink } from 'react-icons/gr';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page != currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    let startNumber, endNumber;

    if (currentPage < 2) {
      startNumber = 1;
      endNumber = Math.min(totalPages, currentPage + 2);
    } else if (currentPage == totalPages) {
      startNumber = Math.max(totalPages - 2, 1);
      endNumber = totalPages;
    } else {
      startNumber = currentPage - 1;
      endNumber = currentPage + 1;
    }

    for (let i = startNumber; i <= endNumber; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-0.5 px-2 py-1 border rounded-full hover:bg-main-300 hover:text-main-100 text-xs cursor-pointer ${
            i === currentPage
              ? 'bg-main-400 text-main-100'
              : 'bg-main-100 text-main-400'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endNumber < totalPages) {
      pageNumbers.push(
        <span
          className={`mx-1 flex items-center text-center rounded-full h-full text-lg hover:bg-main-300 hover:text-main-100 cursor-pointer ${'bg-main-100 text-main-400'}`}
        >
          ...
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={handlePrevious}
        className={`mx-1 px-2 py-1 flex items-center gap-1 border cursor-pointer text-xs rounded-md hover:bg-main-300 hover:text-main-100  ${
          currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-main-100 text-main-400'
        }`}
        disabled={currentPage === 1}
      >
        Previous
        <GrFormPreviousLink />
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        className={`mx-1 px-2 py-1 flex items-center gap-1 border cursor-pointer text-xs rounded-md hover:bg-main-300 hover:text-main-100 ${
          currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-main-100 text-main-400'
        }`}
        disabled={currentPage === totalPages}
      >
        Next
        <GrFormNextLink />
      </button>
    </div>
  );
};

export default Pagination;
