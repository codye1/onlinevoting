import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import plus from '../../../public/plus.svg';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import AddPollModal from './components/AddPoolModal/AddPollModal.tsx';
import PollsList, { PollItem } from '../../components/PollsList.tsx';
import DropDown from '../../components/DropDown.tsx';
import { useGetPollsQuery } from '../../reducer/api.ts';
import getErrorMessage from '../../lib/getErrorMessage.ts';
import iconFilter from '../../../public/filter.svg';
import TextInput from '../../components/TextInput.tsx';
import drop from '../../../public/dropDown.svg';
import { types } from '../../lib/types.ts';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [allPolls, setAllPolls] = useState<PollItem[]>([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortByVotes, setSortByVotes] = useState<'asc' | 'desc' | undefined>();
  const { data, error, isLoading, isFetching } = useGetPollsQuery({
    filter,
    page,
    size: 5,
    search,
    category,
    sortByVotes,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (data) {
      const fetched = data.polls;

      if (fetched.length === 0) {
        setIsEndReached(true);
        return;
      }

      setAllPolls((prev) => {
        const existingIds = new Set(prev.map((poll) => poll.id));
        const newPolls = fetched.filter((poll) => !existingIds.has(poll.id));
        return [...prev, ...newPolls];
      });

      if (fetched.length < 5) {
        setIsEndReached(true);
      }
    }
  }, [data]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(0);
    setAllPolls([]);
    setIsEndReached(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
    setAllPolls([]);
    setIsEndReached(false);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(0);
    setAllPolls([]);
    setIsEndReached(false);
  };

  const handleSortByVotesChange = () => {
    setSortByVotes((value) => {
      if (value === 'asc') return 'desc';
      if (value === 'desc') return undefined;
      return 'asc';
    });
    setPage(0);
    setAllPolls([]);
    setIsEndReached(false);
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || isEndReached) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching && !isEndReached) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isEndReached],
  );

  useEffect(() => {
    return () => {
      setAllPolls([]);
    };
  }, []);

  return (
    <menu>
      <div className={'border-b pb-[20px] flex justify-between'}>
        <span className={'flex items-center'}>
          <img className={'w-[25px] h-[25px]'} src={iconFilter} alt="" />
          <DropDown
            options={[
              { label: 'Усі', value: 'all' },
              { label: 'Закриті', value: 'closed' },
              { label: 'Активні', value: 'active' },
              { label: 'Створені', value: 'created' },
              { label: 'Брав участь', value: 'participated' },
            ]}
            onSelect={handleFilterChange}
            className={'pr-[30px]'}
            name={'filter'}
          />
          <DropDown
            options={[
              { label: 'Без категорії', value: '' },
              { label: 'Кіно та серіали', value: 'Кіно та серіали' },
              { label: 'Музика', value: 'Музика' },
              { label: 'Спорт', value: 'Спорт' },
              { label: 'Технології', value: 'Технології' },
              { label: 'Мода', value: 'Мода' },
              { label: 'Кулінарія', value: 'Кулінарія' },
              { label: 'Подорожі', value: 'Подорожі' },
              { label: 'Книги', value: 'Книги' },
              { label: 'Ігри', value: 'Ігри' },
              { label: 'Політика', value: 'Політика' },
              { label: 'Освіта', value: 'Освіта' },
              { label: 'Наука', value: 'Наука' },
              { label: 'Мистецтво', value: 'Мистецтво' },
              { label: 'Здоров’я та фітнес', value: 'Здоров’я та фітнес' },
              { label: 'Автомобілі', value: 'Автомобілі' },
              { label: 'Домашні улюбленці', value: 'Домашні улюбленці' },
              { label: 'Екологія', value: 'Екологія' },
              {
                label: 'Фінанси та інвестиції',
                value: 'Фінанси та інвестиції',
              },
              { label: 'Стартапи та бізнес', value: 'Стартапи та бізнес' },
              { label: 'Соціальні питання', value: 'Соціальні питання' },
            ]}
            name={'category'}
            className={'mr-[20px]'}
            onSelect={handleCategoryChange}
          />
          <TextInput
            name={'search'}
            placeholder={'Пошук'}
            classNameInput={'p-[10px]'}
            type={types.text}
            trackValue={{
              onChange: handleSearchChange,
              value: search,
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
        <AddPollModal open={openModal} setOpen={setOpenModal} />
      </div>

      {isLoading && page === 0 ? (
        <div>Завантаження...</div>
      ) : error ? (
        <div>Помилка: {getErrorMessage(error)}</div>
      ) : (
        <>
          <div className="flex justify-between items-center px-[20px] py-[10px]  font-semibold">
            <span className="flex-1">Опитування</span>
            <span
              className="w-[100px] text-center flex items-center"
              onClick={() => handleSortByVotesChange()}
            >
              Учасники
              {sortByVotes && (
                <img
                  className={`w-[20px] h-[20px] ${sortByVotes == 'asc' && 'rotate-180'}`}
                  src={drop}
                  alt=""
                />
              )}
            </span>
            <span className="w-[100px] text-center">Дедлайн</span>
            <span className="w-[100px] text-center">Статус</span>
          </div>

          <PollsList polls={allPolls} />
          {!isEndReached && (
            <div ref={lastElementRef} className="h-[1px] bg-transparent" />
          )}
        </>
      )}
    </menu>
  );
};

export default Home;
