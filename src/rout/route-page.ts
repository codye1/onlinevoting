import Home from '../pages/Home.tsx';
import Auth from '../pages/Auth/Auth.tsx';

export const routPages = [
  { path: '', element: Home, exact: true },
  { path: '/auth', element: Auth, exact: true },
];
