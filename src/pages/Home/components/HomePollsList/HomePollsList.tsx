import drop from '@public/dropDown.svg';
import { QueryParams } from '../../Home';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import Error from '@components/Error';
import { IPollItem } from '@components/PollsList/PollItem';
import PollsList from '@components/PollsList/PollsList';
import SkeletonPollsList from '@components/SkeletonPollsList/SkeletonPollsList';

interface PollsData {
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
  data: IPollItem[];
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isFetching: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

interface IHomePollsList {
  polls: PollsData;
}

const HomePollsList = ({ polls }: IHomePollsList) => {
  const {
    queryParams,
    setQueryParams,
    data,
    sentinelRef,
    isLoading,
    isFetching,
    error,
  } = polls;

  const handleSortByVotesChange = () => {
    setQueryParams((prev) => ({
      ...prev,
      sortByVotes:
        prev.sortByVotes === 'asc'
          ? 'desc'
          : prev.sortByVotes === 'desc'
            ? undefined
            : 'asc',
    }));
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <div className="flex justify-between items-center px-[20px] py-[10px]  font-semibold">
        <span className="flex-1">Опитування</span>
        <span
          className="w-[100px] text-center flex items-center"
          onClick={() => handleSortByVotesChange()}
        >
          Учасники
          {queryParams.sortByVotes && (
            <img
              className={`w-[20px] h-[20px] ${queryParams.sortByVotes == 'asc' && 'rotate-180'}`}
              src={drop}
              alt=""
            />
          )}
        </span>
        <span className="w-[100px] text-center">Дедлайн</span>
        <span className="w-[100px] text-center">Статус</span>
      </div>

      {isLoading ? <SkeletonPollsList /> : <PollsList polls={data} />}

      {isFetching && <SkeletonPollsList />}

      <div className="height-[10px]" ref={sentinelRef} />
    </>
  );
};

export default HomePollsList;
