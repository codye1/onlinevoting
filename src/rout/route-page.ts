import Home from '../pages/Home/Home.tsx';
import Test from '../pages/Test.tsx';

export const routPages = [
  { path: '', element: Home, exact: true },
  { path: '/test', element: Test, exact: true },
];
