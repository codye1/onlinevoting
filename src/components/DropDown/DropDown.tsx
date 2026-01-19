import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dropDown from '@public/dropDown.svg';
import DropDownItem from './DropDownItem';

export type Option = {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
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
    options.find((item) => item.value === value) ||
      options.find((item) => !item.disabled) ||
      null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updateMenuPosition = () => {
    const anchor = buttonRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 5,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    setSelected(option);
    onSelect(String(option.value));
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideTrigger = dropdownRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);
      if (!insideTrigger && !insideMenu) setIsOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <h1>{label}</h1>}
      <button
        ref={buttonRef}
        type="button"
        className="bg-light shadow-s text-default rounded-sm  p-[10px] w-full text-left cursor-pointer flex items-center justify-between min-w-[115px]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected ? (
          <div className="flex items-center">
            {selected.icon && (
              <img
                className={'w-[20px] h-[20px] mr-[10px] icon-bw'}
                src={selected.icon}
                alt=""
              />
            )}
            {selected.label}
          </div>
        ) : (
          placeholder
        )}
        <img className={'w-[20px] h-[20px] icon-bw'} src={dropDown} alt="" />
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            className="z-[1001] bg-light shadow-m rounded-sm max-h-60 overflow-y-auto overflow-x-hidden no-scrollbar"
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
          >
            {options.map((option) => (
              <DropDownItem
                key={option.value}
                option={option}
                selected={selected}
                handleSelect={handleSelect}
              />
            ))}
          </ul>,
          document.body,
        )}
      <input type="hidden" name={name} value={selected ? selected.value : ''} />
    </div>
  );
};

export default DropDown;
