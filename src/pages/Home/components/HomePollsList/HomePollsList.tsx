import PollsList, { PollItem } from '@components/PollsList';
import drop from '@public/dropDown.svg';
import { QueryParams } from '../../Home';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

interface PollsData {
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
  data: PollItem[];
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

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка завантаження опитувань</div>;

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

      <PollsList polls={data} />

      {isFetching && <div>Завантаження...</div>}

      <div className="height-[10px]" ref={sentinelRef} />
    </>
  );
};

export default HomePollsList;
