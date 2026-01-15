import { ChangeEvent } from 'react';
import { inputTypes } from '@utils/types.ts';
import Errors from './Errors';

interface TextInput {
  label?: string;
  name: string;
  placeholder: string;
  type: inputTypes;
  classNameInput?: string;
  trackValue?: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  button?: {
    icon: string;
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
    <label className="flex flex-col rounded-md my-[5px]">
      {label}
      <div className="relative w-auto">
        <input
          name={name}
          placeholder={placeholder}
          value={trackValue?.value}
          onChange={trackValue?.onChange}
          className={` p-1 rounded-sm shadow-s  w-full bg-light focus:bg-focus pr-[40px] ${classNameInput}`}
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
      {errors && <Errors errors={errors} />}
    </label>
  );
};

export default TextInput;
