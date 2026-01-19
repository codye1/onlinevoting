import PollHeader from '../Poll/components/PollHeader.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import MyButton from '@components/MyButton.tsx';
import arrowLeft from '@public/arrowLeft.svg';
import refresh from '@public/refresh.svg';
import ResultsMenu from './components/ResultsMenu.tsx';
import { useGetPollResultsQuery } from '../../reducer/api.ts';
import Error from '@components/Error.tsx';
import PollResultsSkeleton from './components/PollResultsSkeleton.tsx';

const PollResults = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: poll,
    isLoading,
    error,
    refetch,
  } = useGetPollResultsQuery({ pollId: id! });

  const handleBackClick = () => {
    if (id) {
      navigate(`/poll/${id}`);
    }
  };

  if (isLoading) {
    return <PollResultsSkeleton />;
  }

  return (
    <menu className="bg-foreground shadow-m rounded p-[20px] max-w-[765px] m-auto">
      {error && <Error error={error} />}

      {poll && (
        <>
          <PollHeader
            creator={poll.creatorEmail}
            title={poll.title}
            startDate={poll.createdAt}
          />
          <ResultsMenu poll={poll} />
          <div className="flex mt-4">
            <MyButton
              label="Оновити результати"
              type="button"
              className="mr-[15px]"
              icon={refresh}
              onClick={() => {
                refetch();
              }}
            />
            <MyButton
              label="Повернутись до опитування"
              type="button"
              icon={arrowLeft}
              onClick={handleBackClick}
            />
          </div>
        </>
      )}
    </menu>
  );
};

export default PollResults;
