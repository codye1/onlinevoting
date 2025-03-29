import { BrowserRouter } from 'react-router-dom';
import Routing from './rout/routing.tsx';
import { useRefreshQuery } from './reducer/api.ts';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { authUser } from './reducer/auth.ts';

function App() {
  const { data } = useRefreshQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      const decoded = jwtDecode(data.accessToken);
      if (!decoded.sub) return;
      dispatch(authUser({ email: decoded.sub }));
    }
  });

  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
