import { useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../../reducer/api';
import logoutIcon from '@public/logout.svg';
import { useAppSelector } from '@hooks/hooks';

const Header = () => {
  const location = useLocation();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const [logout] = useLogoutMutation();

  return (
    <header className="flex justify-between h-[50px] items-center text-2xl">
      <section>Online Voting</section>

      <section className="flex items-center height-full">
        <a
          className={`m-[5px] ${location.pathname == '/' && 'opacity-50'}`}
          href="/"
        >
          Home
        </a>
        {isAuth && (
          <img
            title="Logout"
            className="w-[25px] h-[25px] mr-[5px] cursor-pointer"
            src={logoutIcon}
            alt="Logout"
            onClick={async () => await logout()}
          />
        )}
      </section>
    </header>
  );
};

export default Header;
