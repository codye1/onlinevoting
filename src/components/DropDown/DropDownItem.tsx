import check from '@public/check.svg';
import { Option } from './DropDown';

interface IDropDownItem {
  option: Option;
  selected: boolean;
  handleSelect: (option: {
    label: string;
    value: string | number;
    icon?: string;
  }) => void;
}

const DropDownItem = ({ option, selected, handleSelect }: IDropDownItem) => {
  return (
    <li
      key={option.value}
      className={`${selected && 'bg-selected'} p-2 hover:bg-hover text-default flex justify-between items-center ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => handleSelect(option)}
    >
      <div className="flex items-center">
        {option.icon && (
          <img
            className={'w-[20px] h-[20px] mr-[10px] icon-bw'}
            src={option.icon}
            alt=""
          />
        )}
        {option.label}
      </div>
      {selected && (
        <img className={'w-[20px] h-[20px] icon-bw'} src={check} alt="" />
      )}
    </li>
  );
};

export default DropDownItem;
