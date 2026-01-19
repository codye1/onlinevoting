import Home from '../pages/Home/Home.tsx';
import Poll from '../pages/Poll/Poll.tsx';
import PollResults from '../pages/PollResults/PollResults.tsx';

export const routPages = [
  { path: '/', element: Home, exact: true },
  { path: '/poll/:id', element: Poll, exact: true },
  { path: '/poll/:id/results', element: PollResults, exact: true },
];
