import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import HomeHeader from './components/HomeHeader/HomeHeader.tsx';
import HomePollsList from './components/HomePollsList/HomePollsList.tsx';
import useHome from './useHome.ts';

export interface QueryParams {
  filter: string;
  pageSize: number;
  search: string;
  category: string;
  sortByVotes?: 'asc' | 'desc';
  cursor?: string | null;
}

const Home = () => {
  const polls = useHome();

  return (
    <menu>
      <HomeHeader
        onPollCreated={polls.handlePollCreated}
        queryParams={polls.queryParams}
        setQueryParams={polls.setQueryParams}
      />

      <HomePollsList polls={polls} />
    </menu>
  );
};

export default Home;
