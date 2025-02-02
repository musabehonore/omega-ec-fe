import React, { useState } from 'react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';

interface Item {
  name: string;
  id: string;
}

interface SelectProps<T extends Item> {
  data: T[];
  placeholder?: string;
  selected: T | null;
  loading: boolean;
  setSelected: (selected: T | null) => void;
  search?: boolean;
}

export const Select = <T extends Item>({
  placeholder,
  selected,
  setSelected,
  data,
  search = true
}: SelectProps<T>) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<string>('');

  const filtered = (): T[] => {
    return data.filter(itm =>
      itm.name.toLowerCase().includes(searchData.toLowerCase().trim())
    );
  };

  const handleOptionClick = (item: T | null) => {
    setSelected(item);
    setSearchData('');
    setShowOptions(false);
  };

  return (
    <div
      className="uppercase h-max min-w-40 relative text-xs font-bold cursor-pointer border-b-1 py-1 text-main-400 flex items-center justify-between"
      onClick={() => setShowOptions(!showOptions)}
      onMouseOver={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <span>{selected ? selected.name : placeholder}</span>
      {showOptions ? <FaAngleUp /> : <FaAngleDown />}

      {showOptions && (
        <div className="max-h-72 border shadow-sm bg-main-100 overflow-hidden rounded-b-md min-w-full z-30 absolute left-0 top-8 animate__animated animate__fadeInUp animate__faster">
          {search && (
            <div
              onClick={e => e.stopPropagation()}
              className="px-0 pt-0 h-12 relative"
            >
              <span className="absolute left-1 top-1 h-full flex">
                <IoSearchSharp size={16} />
              </span>
              <input
                placeholder="Search..."
                value={searchData}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchData(e.target.value)
                }
                className="border-b pl-5 placeholder-gray-400 focus:outline-none focus:border-black active:bg-transparent w-full pt-1 p-1 m-0 text-sm block bg-transparent text-main-400"
              />
            </div>
          )}
          <ul className="bg-main-100 max-h-48 pb-3 text-left overflow-y-auto min-w-full z-30 left-0 top-7 animate__animated animate__fadeInUp animate__faster">
            <li
              onClick={e => {
                e.stopPropagation();
                handleOptionClick(null);
              }}
              className={`w-full p-1 px-1 border-x-transparent ${
                selected === null ? 'bg-main-200 font-bold' : ''
              } hover:bg-main-200 uppercase`}
            >
              All
            </li>
            {filtered().map(itm => (
              <li
                key={itm.id}
                onClick={e => {
                  e.stopPropagation();
                  handleOptionClick(itm);
                }}
                className={`w-full p-1 px-1 border-x-transparent ${
                  selected === itm ? 'bg-main-200 font-bold' : ''
                } hover:bg-main-200 uppercase text-xs`}
              >
                {itm.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
