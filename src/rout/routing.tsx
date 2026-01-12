import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routPages } from './route-page.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import Auth from '../pages/Auth/Auth.tsx';

const Routing = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const location = useLocation();
  const redirectUrl = encodeURIComponent(location.pathname + location.search);
  console.log(isAuth);
  return (
    <Routes>
      {isAuth ? (
        routPages.map((route, index) => (
          <Route key={index} path={route.path} element={<route.element />} />
        ))
      ) : (
        <>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="*"
            element={<Navigate to={`/auth?url=${redirectUrl}`} replace />}
          />
        </>
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
