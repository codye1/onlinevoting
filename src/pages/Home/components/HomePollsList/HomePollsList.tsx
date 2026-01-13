import PollsList, { PollItem } from '@components/PollsList';
import drop from '@public/dropDown.svg';
import { QueryParams } from '../../Home';
import { Dispatch } from 'react';

interface IHomePollsList {
  polls: PollItem[];
  queryParams: QueryParams;
  setQueryParams: Dispatch<React.SetStateAction<QueryParams>>;
}

const HomePollsList = ({ polls, queryParams, setQueryParams }: IHomePollsList) => {


    const handleSortByVotesChange = () => {

      setQueryParams((prev) => ({
        ...prev,
        sortByVotes:
          prev.sortByVotes === 'asc' ? 'desc' : prev.sortByVotes === 'desc' ? undefined : 'asc',
      }));
    };

  return(
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

          <PollsList polls={polls} />
        </>
      );
};

export default HomePollsList;