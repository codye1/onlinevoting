import iconFilter from '@public/filter.svg';
import TextInput from '@components/TextInput.tsx';
import plus from '@public/plus.svg';
import DropDown from '@components/DropDown.tsx';
import { categoryOptions, filterOptions } from '../.././constants.ts';
import AddPollModal from '../.././components/HomeHeader/components/AddPoolModal/AddPollModal.tsx';
import { ChangeEvent, Dispatch, useState } from 'react';
import { QueryParams } from '../../Home.tsx';
import { Category, inputTypes } from '@utils/types.ts';

interface IHomeHeader {
  queryParams: QueryParams;
  setQueryParams: Dispatch<React.SetStateAction<QueryParams>>;
  onPollCreated: () => void;
}

const HomeHeader = ({
  queryParams,
  setQueryParams,
  onPollCreated,
}: IHomeHeader) => {
  const [openModal, setOpenModal] = useState(false);

  const handleFilterChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      filter: value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: value,
    }));
  };

  return (
    <div className={'border-b pb-[20px] flex justify-between'}>
      <span className={'flex items-center'}>
        <img
          className={'w-[25px] h-[25px] mr-[10px]'}
          src={iconFilter}
          alt=""
        />
        <DropDown
          options={filterOptions}
          onSelect={handleFilterChange}
          className={'mr-[20px]'}
          name={'filter'}
        />
        <DropDown
          options={[
            { label: 'Категорія', value: Category.ALL },
            ...categoryOptions,
          ]}
          name={'category'}
          className={'mr-[20px]'}
          onSelect={handleCategoryChange}
        />
        <TextInput
          name={'search'}
          placeholder={'Пошук'}
          classNameInput={'p-[10px]'}
          type={inputTypes.text}
          trackValue={{
            onChange: handleSearchChange,
            value: queryParams.search,
          }}
        />
      </span>
      <p
        onClick={() => setOpenModal(true)}
        className={
          'ml-auto flex items-center justify-center text-center cursor-pointer'
        }
      >
        <img className={'w-[15px] h-[15px] mr-[5px]'} src={plus} alt="" />
        Створити опитування
      </p>

      {openModal && (
        <AddPollModal
          handleClose={async (reason) => {
            setOpenModal(false);
            if (reason === 'created') {
              onPollCreated();
            }
          }}
        />
      )}
    </div>
  );
};

export default HomeHeader;
