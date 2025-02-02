import React from 'react';

interface SwitchProps {
  value: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<SwitchProps> = ({ value, onChange }) => {
  const toggleClass = ' transform translate-x-4';

  return (
    <div
      onClick={onChange}
      className={`
        md:w-19 md:h-7 w-14 sm:h-7 sm:w-19 h-4 flex items-center ${value === true ? 'bg-neutral-400' : 'bg-green-400'}  rounded-full p-1 cursor-pointer
      `}
    >
      <div
        className={`
        ${value === true ? 'bg-blue-600' : 'bg-grey-900'}
        md:w-3 md:h-3 sm:h-5 sm:w-5 h-3 w-3 bg-white rounded-full shadow-md transition transform ${!value ? toggleClass : null}
        `}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
