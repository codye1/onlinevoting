import PollHeader from '../Poll/components/PollHeader.tsx';
import errorIcon from '../../../public/error.svg';
import { useNavigate, useParams } from 'react-router-dom';
import MyButton from '../../components/MyButton.tsx';
import arrowLeft from '../../../public/arrowLeft.svg';
import refresh from '../../../public/refresh.svg';
import ResultsMenu from './components/ResultsMenu.tsx';
import { useGetPollResultsQuery } from '../../reducer/api.ts';
import getErrorMessage from '../../lib/getErrorMessage.ts';

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

  return (
    <div className="bg-[rgba(255,255,255,0.25)] rounded p-[20px] max-w-[765px] m-auto">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div
          className={
            'bg-[rgba(255,0,0,0.25)] rounded flex p-[20px] items-center'
          }
        >
          <img
            className={'w-[15px] h-[15px] mr-[10px]'}
            src={errorIcon}
            alt=""
          />
          {getErrorMessage(error)}
        </div>
      ) : (
        poll && (
          <>
            <PollHeader
              creator={poll.creator}
              title={poll.title}
              startDate={poll.startDate}
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
        )
      )}
    </div>
  );
};

export default PollResults;
