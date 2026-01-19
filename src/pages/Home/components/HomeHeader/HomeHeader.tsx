import iconFilter from '@public/filter.svg';
import TextInput from '@components/TextInput.tsx';
import plus from '@public/plus.svg';
import DropDown from '@components/DropDown/DropDown.tsx';
import { categoryOptions, filterOptions } from '../.././constants.ts';
import AddPollModal from './components/AddPollModal/AddPollModal.tsx';
import { ChangeEvent, Dispatch, useState } from 'react';
import { QueryParams } from '../../Home.tsx';
import { Category, inputTypes } from '@utils/types.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import Modal from '@components/Modal.tsx';
import MyButton from '@components/MyButton.tsx';
import Error from '@components/Error.tsx';
import ScrollXControls from '@components/ScrollXControls.tsx';

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
  const [alertModal, setAlertModal] = useState(false);
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  const filterOptionsWithDisabled = filterOptions.map((opt) => ({
    ...opt,
    disabled:
      !isAuth && (opt.value === 'CREATED' || opt.value === 'PARTICIPATED'),
  }));

  const handleFilterChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      filter: value,
      cursor: null,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      search: event.target.value,
      cursor: null,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: value,
      cursor: null,
    }));
  };

  const handleClose = async (reason: 'created' | 'closed') => {
    setOpenModal(false);
    if (reason === 'created') {
      onPollCreated();
    }
  };

  const handleOpen = () => {
    if (!isAuth) {
      setAlertModal(true);
      return;
    }
    setOpenModal(true);
  };

  return (
    <div
      className={
        'border-b pb-[20px] flex justify-between overflow-x-scroll md:overflow-x-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] home-header-scroll'
      }
    >
      <ScrollXControls targetClass="home-header-scroll" step={50} />
      <section className={'flex items-center min-w-[510px] mr-[5px]'}>
        <img
          className={'w-[25px] h-[25px] mr-[10px] icon-bw'}
          src={iconFilter}
          alt=""
        />
        <DropDown
          options={filterOptionsWithDisabled}
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
          classNameInput={'p-[10px] min-w-[205px]'}
          type={inputTypes.text}
          trackValue={{
            onChange: handleSearchChange,
            value: queryParams.search,
          }}
        />
      </section>
      <p
        onClick={handleOpen}
        className={
          'ml-auto flex items-center justify-center text-center cursor-pointer min-w-[156px]'
        }
      >
        <img
          className={'w-[15px] h-[15px] mr-[5px] icon-bw'}
          src={plus}
          alt=""
        />
        Створити опитування
      </p>
      {alertModal && (
        <Modal close={() => setAlertModal(false)}>
          <Error
            error={
              'Щоб створювати опитування, будь ласка, увійдіть у свій акаунт.'
            }
            className={'mt-[20px]'}
          />
          <MyButton
            label="Ввійти"
            type="button"
            onClick={() => (window.location.href = '/auth')}
            className={'mt-[20px]'}
          />
        </Modal>
      )}
      {openModal && <AddPollModal handleClose={handleClose} />}
    </div>
  );
};

export default HomeHeader;
