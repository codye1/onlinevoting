import { useEffect, useRef, useState } from 'react';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { useGetPollsQuery } from '../../reducer/api.ts';
import getErrorMessage from '../../utils/getErrorMessage.ts';

import { Category } from '../../utils/types.ts';
import HomeHeader from './components/HomeHeader/HomeHeader.tsx';
import HomePollsList from './components/HomePollsList/HomePollsList.tsx';
import { PollItem } from '@components/PollsList.tsx';

export interface QueryParams {
  filter: string;
  pageSize: number;
  search: string;
  category: string;
  sortByVotes?: 'asc' | 'desc';
  cursor?: string | null;
}

const Home = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    filter: 'ALL',
    pageSize: 10,
    search: '',
    category: Category.ALL,
    cursor: null,
  });

  const [polls, setPolls] = useState<PollItem[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, error, isLoading, isFetching, refetch } =
    useGetPollsQuery(queryParams);

  const handlePollCreated = () => {
    setPolls([]);

    if (queryParams.cursor !== null) {
      setQueryParams((prev) => ({ ...prev, cursor: null }));
      return;
    }

    void refetch();
  };

  useEffect(() => {
    setPolls([]);
    setQueryParams((prev) => ({ ...prev, cursor: null }));
  }, [
    queryParams.filter,
    queryParams.search,
    queryParams.category,
    queryParams.sortByVotes,
  ]);

  useEffect(() => {
    if (!data) return;

    setPolls((prev) =>
      queryParams.cursor ? [...prev, ...data.polls] : data.polls,
    );
  }, [data]);

  useEffect(() => {
    if (!sentinelRef.current || !data?.hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setQueryParams((prev) => ({
            ...prev,
            cursor: data.nextCursor,
          }));
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [data?.nextCursor, data?.hasMore, isFetching]);

  return (
    <menu>
      <HomeHeader
        onPollCreated={handlePollCreated}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />

      {isLoading && <div>Завантаження...</div>}

      {error && <div>Помилка: {getErrorMessage(error)}</div>}

      <HomePollsList
        polls={polls}
        setQueryParams={setQueryParams}
        queryParams={queryParams}
      />

      {isFetching && <div>Завантаження...</div>}

      <div className="height-[10px]" ref={sentinelRef} />
    </menu>
  );
};

export default Home;
