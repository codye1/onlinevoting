import { PollItem } from '@components/PollsList';
import { Category } from '@utils/types';
import { useEffect, useRef, useState } from 'react';
import { QueryParams } from './Home';
import { useGetPollsQuery } from '../../reducer/api';

const useHome = () => {
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

  useEffect(() => {
    setPolls([]);
    setQueryParams((prev) => ({ ...prev, cursor: null }));
    console.log('Query params changed:', queryParams);
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

  const handlePollCreated = () => {
    setPolls([]);

    if (queryParams.cursor !== null) {
      setQueryParams((prev) => ({ ...prev, cursor: null }));
      return;
    }

    void refetch();
  };
  return {
    queryParams,
    setQueryParams,
    handlePollCreated,
    data: polls,
    sentinelRef,
    isLoading,
    isFetching,
    error,
  };
};

export default useHome;
