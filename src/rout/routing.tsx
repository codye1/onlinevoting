import { Navigate, Route, Routes } from 'react-router-dom';
import { routPages } from './route-page.ts';
import { useAppSelector } from '../hooks/hooks.tsx';
import Auth from '../pages/Auth/Auth.tsx';

const Routing = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  console.log(isAuth);
  return (
    <Routes>
      {routPages.map((route, index) => (
        <Route key={index} path={route.path} element={<route.element />} />
      ))}
      {!isAuth && <Route path="/auth" element={<Auth />} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
