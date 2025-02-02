import React, { FormEventHandler } from 'react';
import { ChangeEventHandler, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoSearchSharp } from 'react-icons/io5';

interface SearchProps {
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  value: string;
  loading: boolean;
}

export const Search = ({ loading, onSubmit, ...rest }: SearchProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-row bg-main-100 justify-between w-full lg:w-1/2 marker:items-center relative rounded-md text-main-400 overflow-hidden"
    >
      <span className="absolute left-2 h-full items-center flex">
        <IoSearchSharp size={24} />
      </span>
      <input
        {...rest}
        type="text"
        className="border bg-main-100 border-main-400 h-9 w-full px-2 bg-gray-100 rounded-md pl-6 md:pr-24 pr-4 lg:pr-64 "
      />
      <button className="bg-main-400  h-9  text-main-100 font-normal text-sm absolute right-0 rounded-e-md hover:bg-main-300 animate__animated animate__faster ">
        {loading ? (
          <span className="lg:flex items-center justify-center gap-2 hidden lg:px-16">
            <AiOutlineLoading3Quarters className="text-base text-main-100 animate-spin" />
            Searching...
          </span>
        ) : (
          <span className="lg:px-14 px-12 text-xs md:px-14 md:text-sm hidden sm:block">
            Search
          </span>
        )}
      </button>
    </form>
  );
};
