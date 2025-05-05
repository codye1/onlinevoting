import PollHeader from '../Poll/components/PollHeader.tsx';

import { useNavigate, useParams } from 'react-router-dom';
import MyButton from '../../components/MyButton.tsx';
import arrowLeft from '../../../public/arrowLeft.svg';
import refresh from '../../../public/refresh.svg';
import ResultsMenu from './components/ResultsMenu.tsx';
import { useGetPollResultsQuery } from '../../reducer/api.ts';

const PollResults = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: poll,
    isLoading,
    error,
  } = useGetPollResultsQuery({ pollId: id! }, { skip: !id });

  const handleBackClick = () => {
    if (id) {
      navigate(`/poll/${id}`);
    }
  };

  if (!poll) return <div>Error</div>;

  return (
    <div className="bg-[rgba(255,255,255,0.25)] rounded p-[20px] max-w-[765px] m-auto">
      <PollHeader
        creator={poll.creator}
        title={poll.title}
        startDate={poll.startDate}
      />
      <ResultsMenu poll={poll} />
      <div className="flex mt-4">
        <MyButton
          label="Refresh results"
          type="button"
          className="mr-[15px]"
          icon={refresh}
          onClick={() => {}}
        />
        <MyButton
          label="Back to poll"
          type="button"
          icon={arrowLeft}
          onClick={handleBackClick}
        />
      </div>
    </div>
  );
};

export default PollResults;
