import { useState } from 'react';
import check from '../../public/check.svg';
import dropDown from '../../public/dropDown.svg';

type Option = {
  label: string;
  value: string;
  icon?: string;
};

type DropDown = {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  name: string;
  label?: string;
};

const DropDown = ({
  options,
  onSelect,
  placeholder = 'Select an option',
  name,
  className,
  value,
  label,
}: DropDown) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(
    options.find((item) => item.value == value) || options[0],
  );

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && <h1>{label}</h1>}
      <button
        type="button"
        className="bg-[#4B4B4B] text-white rounded-sm  p-[10px] w-full text-left cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected ? (
          <div className="flex items-center">
            {selected.icon && (
              <img
                className={'w-[20px] h-[20px] mr-[10px]'}
                src={selected.icon}
                alt=""
              />
            )}
            {selected.label}
          </div>
        ) : (
          placeholder
        )}
        <img className={'w-[20px] h-[20px]'} src={dropDown} alt="" />
      </button>

      {isOpen && (
        <ul className="absolute z-10 bg-[#4B4B4B] border border-gray-600 rounded-sm mt-[-2px] w-full max-h-60 overflow-y-auto shadow-lg mt-[5px] overflow-x-hidden overflow-y-auto no-scrollbar">
          {options.map((option) => (
            <li
              key={option.value}
              className="p-2 hover:bg-gray-600 cursor-pointer text-white flex justify-between items-center"
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-center">
                {option.icon && (
                  <img
                    className={'w-[20px] h-[20px] mr-[10px]'}
                    src={option.icon}
                    alt=""
                  />
                )}
                {option.label}
              </div>
              {selected && option.label == selected.label && (
                <img className={'w-[20px] h-[20px]'} src={check} alt="" />
              )}
            </li>
          ))}
        </ul>
      )}
      <input type="hidden" name={name} value={selected ? selected.value : ''} />
    </div>
  );
};

export default DropDown;
