import ToggleCheckbox from './ToggleCheckbox.tsx';
import { ReactNode } from 'react';
import pointer from '../public/pointer.svg';

interface SettingSection {
  children: ReactNode;
  checked: boolean;
  className?: string;
  setChecked: (checked: boolean) => void;
  classNameChildren?: string;
  label: string;
  name?: string;
}

const SettingSection = ({
  checked,
  setChecked,
  children,
  label,
  className,
  classNameChildren,
  name,
}: SettingSection) => {
  return (
    <label htmlFor="" className={className}>
      <div className={`flex ${classNameChildren}`}>
        <span className={'mr-[40px]'}>{label}</span>

        <ToggleCheckbox checked={checked} onChange={setChecked} name={name} />
      </div>
      {checked && (
        <div className={'flex h-[40px] items-center '}>
          <img
            className={'w-[20px] h-[20px] rotate-180 mr-[10px]'}
            src={pointer}
            alt=""
          />
          {children}
        </div>
      )}
    </label>
  );
};

export default SettingSection;
