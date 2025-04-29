import { useState } from 'react';
import plus from '../../../public/plus.svg';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import AddPollModal from './components/AddPoolModal/AddPollModal.tsx';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <menu className={'border-b pb-[20px] flex'}>
      <p className={'mr-[5px]'}>Активні</p>
      <p className={'mr-[5px]'}>Проголосовані</p>
      <p className={'mr-[5px]'}>Завершені</p>
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
    </menu>
  );
};

export default Home;
