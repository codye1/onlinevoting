import description from '../../../public/description.svg';
import OptionsList from './components/OptionsList.tsx';
import MyButton from '../../components/MyButton.tsx';
import arrow from '../../../public/arrow.svg';
import results from '../../../public/results.svg';
import PollHeader from './components/PollHeader.tsx';
import { useAppSelector } from '../../hooks/hooks.tsx';
import { useState } from 'react';
import { useGetPollQuery, useVoteMutation } from '../../reducer/api.ts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface ImageOption {
  file: string | null;
  title: string;
}

interface Poll {
  id: string;
  creator: string;
  title: string;
  image: string | null;
  description: string;
  visibility: string;
  type: string;
  startDate: string;
  endDate: string | null;
  userVote: number | null;
  options: ImageOption[];
}

export interface Vote {
  pollId: string;
  userId: string;
  indexChoice: number;
  voteDate: Date;
}

const Poll = () => {
  const userId = useAppSelector((state) => state.auth.user.id);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error } = useGetPollQuery(
    { pollId: id! },
    { skip: !id },
  );

  const [userVote, setUserVote] = useState<number | null>(null);
  const [vote, { error: voteError, isLoading: voteLoading }] =
    useVoteMutation();

  if (isLoading) {
    return <div>Loading poll...</div>;
  }

  if (error || !id || !data) {
    return <div>Error loading poll or invalid poll ID</div>;
  }

  if (userVote === null && data.userVote !== null) {
    setUserVote(data.userVote);
  }
  console.log(data);
  return (
    <menu
      className={
        'bg-[rgba(255,255,255,0.25)] rounded p-[20px] max-w-[765px] m-auto'
      }
    >
      <PollHeader
        title={data.title}
        creator={data.creator}
        startDate={data.startDate}
      />
      <span className={'mt-[20px] flex font-normal'}>
        {data.description && (
          <img
            className={'w-[20px] h-[20px] mr-[10px]'}
            src={description}
            alt=""
          />
        )}
        <div>
          {data.description && data.description}
          {data.image && (
            <img className={'mt-[20px] m-auto'} src={data.image} alt="" />
          )}
        </div>
      </span>
      <span>
        <h1>Зроби свій вибір</h1>
        <OptionsList
          options={data.options}
          selectedIndex={userVote}
          error={voteError}
          handleOptionChange={(index) => {
            console.log(index);
            setUserVote(index);
          }}
        />
        <div className={'flex'}>
          <MyButton
            label={'Проголосувати'}
            type={'button'}
            isLoading={voteLoading}
            onClick={async () => {
              if (userVote !== null) {
                console.log(userVote);
                await vote({
                  pollId: data.id,
                  userId,
                  indexChoice: userVote,
                  voteDate: new Date(),
                });
              }
            }}
            icon={arrow}
            iconRight={true}
            className={'pr-[20px] pl-[20px] mr-[20px]'}
          />
          <MyButton
            label={'Показати результати'}
            type={'button'}
            icon={results}
            onClick={() => {
              navigate(location.pathname + '/results');
            }}
            className={'pr-[20px] pl-[20px]'}
          />
        </div>
      </span>
    </menu>
  );
};

export default Poll;
