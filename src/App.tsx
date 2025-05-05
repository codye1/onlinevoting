import { BrowserRouter } from 'react-router-dom';
import Routing from './rout/routing.tsx';
import { useRefreshQuery } from './reducer/api.ts';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { authUser } from './reducer/auth.ts';
import Header from './components/Header/Header.tsx';

interface DecodedToken {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

function App() {
  const { data } = useRefreshQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      const decoded = jwtDecode<DecodedToken>(data.accessToken);
      if (!decoded.sub) return;
      console.log(decoded);
      localStorage.setItem('token', data.accessToken);
      dispatch(authUser({ email: decoded.email, id: decoded.sub }));
    } else {
      localStorage.removeItem('token');
    }
  });

  return (
    <BrowserRouter>
      <Header />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
