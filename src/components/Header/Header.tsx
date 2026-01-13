import { useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../../reducer/api';

const Header = () => {
  const location = useLocation();

  const [logout] = useLogoutMutation();

  return (
    <header className="flex justify-end h-[50px] items-center text-2xl">
      <a
        className={`m-[5px] ${location.pathname == '/' && 'opacity-50'}`}
        href="/"
      >
        Home
      </a>
      <button onClick={async () => await logout()}>Logout</button>
    </header>
  );
};

export default Header;
