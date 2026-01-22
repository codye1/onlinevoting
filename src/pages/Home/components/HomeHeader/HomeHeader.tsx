import iconFilter from '@public/filter.svg';
import TextInput from '@components/TextInput.tsx';
import plus from '@public/plus.svg';
import DropDown from '@components/DropDown/DropDown.tsx';
import { categoryOptions, filterOptions } from '../.././constants.ts';
import AddPollModal from './components/AddPollModal/AddPollModal.tsx';
import { Dispatch, useEffect, useState } from 'react';
import { QueryParams } from '../../Home.tsx';
import { Category, inputTypes } from '@utils/types.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import Modal from '@components/Modal.tsx';
import MyButton from '@components/MyButton.tsx';
import Error from '@components/Error.tsx';
import ScrollXControls from '@components/ScrollXControls.tsx';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@hooks/useDebounce.ts';

interface IHomeHeader {
  queryParams: QueryParams;
  setQueryParams: Dispatch<React.SetStateAction<QueryParams>>;
  handlePollCreated: () => void;
}

const HomeHeader = ({
  queryParams,
  setQueryParams,
  handlePollCreated,
}: IHomeHeader) => {
  const [addPollModalOpen, setAddPollModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();
  const filterOptionsWithDisabled = filterOptions.map((opt) => ({
    ...opt,
    disabled:
      !isAuth && (opt.value === 'CREATED' || opt.value === 'PARTICIPATED'),
  }));
  const [search, setSearch] = useState(queryParams.search);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      search: debouncedSearch,
      cursor: null,
    }));
  }, [debouncedSearch, setQueryParams]);

  const handleFilterChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      filter: value,
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
    setAddPollModalOpen(false);
    if (reason === 'created') {
      handlePollCreated();
    }
  };

  const handleOpen = () => {
    if (!isAuth) {
      setAlertModalOpen(true);
      return;
    }
    setAddPollModalOpen(true);
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
            onChange: (e) => setSearch(e.target.value),
            value: search,
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
      <Modal isOpen={alertModalOpen} close={() => setAlertModalOpen(false)}>
        <Error
          error={
            'Щоб створювати опитування, будь ласка, увійдіть у свій акаунт.'
          }
          className={'mt-[20px]'}
        />
        <MyButton
          label="Ввійти"
          type="button"
          onClick={() => navigate('/auth')}
          className={'mt-[20px] mx-auto'}
        />
      </Modal>
      <AddPollModal isOpen={addPollModalOpen} handleClose={handleClose} />
    </div>
  );
};

export default HomeHeader;
