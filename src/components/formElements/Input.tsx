import React from 'react';
import { ChangeEventHandler, useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';

interface InputProps {
  label: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string | File[] | undefined;
  valid: boolean;
  type?: React.HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  readOnly?: boolean;
}

export const Input = ({ type = 'text', valid, value, ...rest }: InputProps) => {
  const [passwordMode, setPasswordMode] = useState<boolean>(true);

  let displayValue: string;
  if (Array.isArray(value)) {
    displayValue = value.map(file => file.name).join(', ');
  } else {
    displayValue = value || '';
  }

  return (
    <div className="relative">
      <input
        {...rest}
        value={displayValue}
        type={type === 'password' && !passwordMode ? 'text' : type || 'text'}
        className={`border-b-2 placeholder-gray-400 focus:outline-none focus:border-black active:bg-transparent w-full pt-4 p-2 m-0 text-sm block bg-transparent ${valid ? 'border-gray-400' : 'border-red-600'} text-main-400`}
      />
      {type === 'password' && (
        <div
          onClick={() => setPasswordMode(!passwordMode)}
          className="absolute right-0 top-4 cursor-pointer hover:scale-x-110 text-main-200 hover:text-main-300"
        >
          {passwordMode ? <GoEye size={20} /> : <GoEyeClosed size={20} />}
        </div>
      )}
    </div>
  );
};
