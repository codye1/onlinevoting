import description from '@public/description.svg';
import MyButton from '@components/MyButton.tsx';
import arrow from '@public/arrow.svg';
import results from '@public/results.svg';
import PollHeader from './components/PollHeader.tsx';
import PollSkeleton from './components/PollSkeleton.tsx';
import { useEffect, useState } from 'react';
import {
  useGetPollQuery,
  useVoteMutation,
} from '@reducer/api/slices/pollSlice.ts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Error from '@components/Error.tsx';
import OptionsList from './components/OptionsList/OptionsList.tsx';
import { useAppSelector } from '@hooks/hooks.tsx';

export interface Vote {
  optionId: string;
  pollId: string;
}

const Poll = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const { data, isLoading, error } = useGetPollQuery(
    { pollId: id! },
    { skip: !id },
  );
  const [userVote, setUserVote] = useState<string | null>(null);
  const [vote, { error: voteError, isLoading: voteLoading }] =
    useVoteMutation();

  useEffect(() => {
    if (userVote === null && data?.userVote) {
      setUserVote(data.userVote.id);
    }
  }, [data?.userVote, userVote]);

  const onVote = async () => {
    if (userVote !== null) {
      await vote({
        optionId: userVote,
        pollId: id!,
      }).unwrap();
    }
  };

  if (isLoading) {
    return <PollSkeleton />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return <Error error={'Опитування не знайдено'} />;
  }

  const isExpired =
    !!data.expireAt && new Date(data.expireAt).getTime() <= Date.now();

  return (
    <menu
      className={'bg-foreground shadow-m rounded p-[20px] max-w-[765px] m-auto'}
    >
      <PollHeader
        title={data.title}
        creator={data.creator?.email || 'Анонім'}
        startDate={data.createdAt}
        expireAt={data.expireAt}
      />
      <section className={'mt-[20px] flex font-normal'}>
        {data.description && (
          <img
            className={'w-[20px] h-[20px] mr-[10px] icon-bw'}
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
      </section>
      <section>
        {!data.description && <h2>Зроби свій вибір</h2>}
        <OptionsList
          options={data.options}
          selectedOptionId={userVote || ''}
          error={voteError}
          isDisabled={isExpired}
          pollType={data.type}
          handleOptionChange={(optionId) => {
            setUserVote(optionId);
          }}
        />
        <div className={'flex'}>
          <MyButton
            label={'Проголосувати'}
            isDisabled={!isAuth || isExpired}
            type={'button'}
            isLoading={voteLoading}
            onClick={onVote}
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
      </section>
    </menu>
  );
};

export default Poll;
