import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ButtonProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  style: ButtonStyle;
  //   icon?:
}

export enum ButtonStyle {
  LIGHT = 'light',
  DARK = 'dark'
}

export const ButtonComponent = (props: ButtonProps) => {
  return (
    <div className="relative">
      <button
        type={'submit'}
        disabled={props.disabled}
        className={`rounded-full w-max p-3 text-base hover:bg-main-300 hover:shadow-md flex items-center justify-center gap-2 cursor-pointer mt-10 mx-auto  ${
          props.style === ButtonStyle.LIGHT
            ? 'border-1 border-main-400  font-medium text-main-400 bg-transparent'
            : props.style === ButtonStyle.DARK
              ? 'bg-main-400 text-main-100 font-medium'
              : props.loading
                ? 'animate-ping'
                : ''
        }`}
      >
        {props.loading ? (
          <span className="flex items-center justify-center gap-2 px-16">
            <AiOutlineLoading3Quarters className="text-base text-main-100 animate-spin" />
            Please wait...
          </span>
        ) : (
          <span className="px-24">{props.label}</span>
        )}
      </button>
    </div>
  );
};
