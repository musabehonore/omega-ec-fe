import React from 'react';
import { IconType } from 'react-icons';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ButtonProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  style: ButtonStyle;
  size?: ButtonSize;
  icon?: IconType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export enum ButtonSize {
  SMALL = 'SMALL',
  MID = 'MID',
  MAX = 'MAX'
}

export enum ButtonStyle {
  LIGHT = 'light',
  DARK = 'dark',
  DISABLED = 'DISABLED',
  DELETE = 'DELETE',
  Primary = 'Primary'
}

export const Button = ({
  loading,
  label,
  style,
  size,
  icon,
  onClick,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={'submit'}
      {...rest}
      className={`rounded-full max-w-full min-w-52 md:w-max justify-center ${size === ButtonSize.MAX ? 'px-4 py-2 text-lg' : size === ButtonSize.SMALL ? 'px-2 py-1 text-sm' : 'px-3 py-2 text-md'} text-sm  flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform transform lg:mt-2 mx-auto  ${
        style === ButtonStyle.LIGHT
          ? 'border border-main-400  font-medium text-main-400 bg-main-100 bg-transparent hover:bg-main-150 hover:border-1'
          : style === ButtonStyle.DARK
            ? 'bg-main-400 text-main-100 font-medium hover:bg-main-300 hover:shadow-md border border-white'
            : loading
              ? 'animate-ping'
              : ''
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <AiOutlineLoading3Quarters className="text-base text-main-100 animate-spin" />
          Loading...
        </span>
      ) : (
        <span className=" flex gap-2 items-center text-main-200">
          {icon && React.createElement(icon, { size: 20 })}
          <span
            className={`${style === ButtonStyle.DARK ? 'text-main-100' : 'text-main-400'}`}
          >
            {label}
          </span>
        </span>
      )}
    </button>
  );
};
