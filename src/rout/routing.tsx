import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routPages } from './route-page.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import Auth from '../pages/Auth/Auth.tsx';

const Routing = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const location = useLocation();

  const authRedirectTarget = (() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('url');
    if (!raw) return '/';

    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // ignore malformed encoding
    }

    // Basic safety + avoid loops.
    if (!decoded.startsWith('/') || decoded.startsWith('/auth')) return '/';
    return decoded;
  })();

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isAuth ? <Navigate to={authRedirectTarget} replace /> : <Auth />
        }
      />

      {routPages.map((route, index) => (
        <Route key={index} path={route.path} element={<route.element />} />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
