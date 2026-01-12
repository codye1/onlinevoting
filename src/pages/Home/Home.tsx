import {  useEffect, useState } from 'react';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


import { useGetPollsQuery } from '../../reducer/api.ts';
import getErrorMessage from '../../utils/getErrorMessage.ts';


import { Category,} from '../../utils/types.ts';
import HomeHeader from './components/HomeHeader/HomeHeader.tsx';
import HomePollsList from './components/HomePollsList/HomePollsList.tsx';

export interface QueryParams {
   filter: string;
    pageSize: number;
    search: string;
    category: string;
    sortByVotes?: "asc" | "desc";
}

const Home = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    filter: 'ALL',
    pageSize: 5,
    search: '',
    category: Category.ALL,
  });
  const { data, error, isLoading, refetch } = useGetPollsQuery(queryParams);

  useEffect(() => {
    refetch();
  }, [queryParams]);



  return (
    <menu>

      <HomeHeader
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        refetch={refetch}
      />

      {isLoading && <div>Завантаження...</div>}

      {error && <div>Помилка: {getErrorMessage(error)}</div>}

      {data && <HomePollsList polls={data.polls} setQueryParams={setQueryParams} queryParams={queryParams} />}
    </menu>
  );
};

export default Home;
