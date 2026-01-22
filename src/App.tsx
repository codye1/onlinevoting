import { BrowserRouter } from 'react-router-dom';
import Routing from './rout/routing.tsx';
import { useRefreshMutation } from '@reducer/api/slices/authSlice.ts';
import { useEffect } from 'react';
import Header from './components/Header/Header.tsx';
import ToastsList from '@components/ToastsList/ToastsList.tsx';

function App() {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <BrowserRouter>
      <Header />
      <Routing />
      <ToastsList />
    </BrowserRouter>
  );
}

export default App;
