import { BrowserRouter } from 'react-router-dom';
import Routing from './rout/routing.tsx';
import { useRefreshMutation } from './reducer/api.ts';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { authUser } from './reducer/auth.ts';
import Header from './components/Header/Header.tsx';

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

function App() {
  const [refresh, { data, isSuccess, isError }] = useRefreshMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (isSuccess && data) {
      const decoded = jwtDecode<DecodedToken>(data.accessToken);
      console.log('Decoded token:', decoded);
      if (!decoded.userId) return;
      console.log(decoded);
      localStorage.setItem('token', data.accessToken);
      dispatch(authUser({ email: decoded.email, id: decoded.userId }));
    }

    if (isError) {
      localStorage.removeItem('token');
    }
  }, [data, isSuccess, isError, dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
