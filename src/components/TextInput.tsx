import { ChangeEvent } from 'react';
import { types } from '../lib/types.ts';

interface TextInput {
  label?: string;
  name: string;
  placeholder: string;
  type: types;
  classNameInput?: string;
  trackValue?: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  button?: {
    icon: string; // Путь к SVG или название иконки
    onClick?: () => void;
  };
  errors?: string[];
}

const TextInput = ({
  label,
  placeholder,
  type,
  errors,
  name,
  button,
  trackValue,
  classNameInput = 'p-[15px]',
}: TextInput) => {
  return (
    <label className="flex flex-col rounded-md m-[5px]">
      {label}
      <div className="relative w-auto">
        <input
          name={name}
          placeholder={placeholder}
          value={trackValue?.value}
          onChange={trackValue?.onChange}
          className={` p-1 rounded-sm shadow-sm  w-full bg-[#4B4B4B] pr-[40px] ${classNameInput}`}
          type={type}
        />
        {button && (
          <img
            className={
              'w-[40px] h-[40px] absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
            }
            src={button.icon}
            onClick={button.onClick}
            alt=""
          />
        )}
      </div>
      {errors && (
        <ul className="text-start text-sm text-red-500 text-xs">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default TextInput;
