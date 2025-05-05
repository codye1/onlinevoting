import { useState } from 'react';
import plus from '../../../public/plus.svg';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import AddPollModal from './components/AddPoolModal/AddPollModal.tsx';
import PollsList from '../../components/PollsList.tsx';
import DropDown from '../../components/DropDown.tsx';
import { useGetPollsQuery } from '../../reducer/api.ts';
import getErrorMessage from '../../lib/getErrorMessage.ts';
import iconFilter from '../../../public/filter.svg';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const { data, error, isLoading, refetch } = useGetPollsQuery({
    filter: filter,
    page: 0,
    size: 5,
    search: '',
  });

  console.log(data);

  return (
    <menu>
      <div className={'border-b pb-[20px] flex justify-between'}>
        <span className={'flex items-center'}>
          <img className={'w-[25px] h-[25px]'} src={iconFilter} alt="" />
          <DropDown
            options={[
              { label: 'All', value: 'all' },
              { label: 'Closed', value: 'closed' },
              { label: 'Active', value: 'active' },
              { label: 'Created', value: 'created' },
              { label: 'Participated', value: 'participated' },
            ]}
            onSelect={(value) => {
              setFilter(value);
              refetch();
            }}
            className={'pr-[30px]'}
            name={'filter'}
          />
        </span>
        <p
          onClick={() => setOpenModal(true)}
          className={
            'ml-auto flex items-center justify-center text-center cursor-pointer'
          }
        >
          <img className={'w-[15px] h-[15px] mr-[5px]'} src={plus} alt="" />
          Створити голосування
        </p>
        <AddPollModal open={openModal} setOpen={setOpenModal} />
      </div>
      {isLoading ? (
        <div>Poll loading...</div>
      ) : error ? (
        <div>Error: {getErrorMessage(error)}</div>
      ) : (
        data && <PollsList polls={data.polls} />
      )}
    </menu>
  );
};

export default Home;
