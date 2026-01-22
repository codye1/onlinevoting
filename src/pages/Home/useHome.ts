import { Category } from '@utils/types';
import { useEffect, useRef, useState } from 'react';
import { QueryParams } from './Home';
import { useGetPollsQuery } from '@reducer/api/slices/pollSlice.ts';
import { IPollItem } from '@components/PollsList/PollItem';

const useHome = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    filter: 'ALL',
    pageSize: 10,
    search: '',
    category: Category.ALL,
    cursor: null,
  });

  const [polls, setPolls] = useState<IPollItem[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<QueryParams['cursor']>(queryParams.cursor);
  const { data, error, isLoading, isFetching, refetch } =
    useGetPollsQuery(queryParams);

  useEffect(() => {
    cursorRef.current = queryParams.cursor;
  }, [queryParams.cursor]);

  useEffect(() => {
    setPolls([]);
  }, [
    queryParams.filter,
    queryParams.search,
    queryParams.category,
    queryParams.sortByVotes,
  ]);

  useEffect(() => {
    if (!data) return;

    setPolls((prev) =>
      cursorRef.current ? [...prev, ...data.polls] : data.polls,
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
    polls: {
      data: polls,
      sentinelRef,
      isLoading,
      isFetching,
      error,
    },
    queryParams,
    setQueryParams,
    handlePollCreated,
  };
};

export default useHome;
