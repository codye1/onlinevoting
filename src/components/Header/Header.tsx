import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="flex justify-end h-[50px] items-center text-2xl">
      <a
        className={`m-[5px] ${location.pathname == '/' && 'opacity-50'}`}
        href="/"
      >
        Home
      </a>
      <a
        className={`m-[5px] ${location.pathname == '/profile' && 'opacity-50'}`}
        href="/profile"
      >
        Profile
      </a>
    </header>
  );
};

export default Header;
