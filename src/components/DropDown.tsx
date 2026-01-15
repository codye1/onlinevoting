import { useEffect, useRef, useState } from 'react';
import check from '@public/check.svg';
import dropDown from '@public/dropDown.svg';

type Option = {
  label: string;
  value: string | number;
  icon?: string;
};

interface IDropDown {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string | number;
  name: string;
  label?: string;
}

const DropDown = ({
  options,
  onSelect,
  placeholder = 'Select an option',
  name,
  className,
  value,
  label,
}: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(
    options.find((item) => item.value == value) || options[0],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(String(option.value));
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <h1>{label}</h1>}
      <button
        type="button"
        className="bg-light shadow-s text-white rounded-sm  p-[10px] w-full text-left cursor-pointer flex items-center justify-between min-w-[115px]"
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
        <ul className="absolute z-10 bg-light shadow-m mt-[5px] rounded-sm w-full max-h-60 overflow-y-auto overflow-x-hidden no-scrollbar ">
          {options.map((option) => (
            <li
              key={option.value}
              className="p-2 hover:bg-hover cursor-pointer text-white flex justify-between items-center"
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
