import {
  Navigate,
  Route,
  Routes,
  matchPath,
  useLocation,
} from 'react-router-dom';
import { routPages } from './route-page.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import Auth from '../pages/Auth/Auth.tsx';

const Routing = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const location = useLocation();

  const isKnownAppPath = (pathname: string) =>
    routPages.some((route) =>
      matchPath({ path: route.path, end: true }, pathname),
    );

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

    const target = decoded.trim();

    // Basic safety + avoid loops.
    // - only allow in-app absolute paths
    // - block protocol-relative URLs like "//evil.com"
    // - block backslashes to avoid weird path parsing edge-cases
    if (
      !target.startsWith('/') ||
      target.startsWith('//') ||
      target.includes('\\') ||
      target.startsWith('/auth')
    ) {
      return '/';
    }

    const pathname = target.split(/[?#]/, 1)[0];
    if (!isKnownAppPath(pathname)) return '/';

    return target;
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
