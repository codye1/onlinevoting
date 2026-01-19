import { useLogoutMutation } from '../../reducer/api';
import logoutIcon from '@public/logout.svg';
import loginIcon from '@public/login.svg';
import { useAppSelector } from '@hooks/hooks';
import ThemeSwitcher from './ThemeSwitcher/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between h-[50px] items-center text-2xl">
      <a
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        Online Voting
      </a>

      <section className="flex items-center height-full">
        <ThemeSwitcher />
        {isAuth ? (
          <img
            title="Logout"
            className="w-[25px] h-[25px] cursor-pointer icon-bw"
            src={logoutIcon}
            alt={'Logout'}
            onClick={async () => {
              document.body.classList.add('loading');
              try {
                await logout().unwrap();
              } finally {
                document.body.classList.remove('loading');
                window.location.reload();
              }
            }}
          />
        ) : (
          <img
            title="Login"
            className="w-[25px] h-[25px] mr-[5px] cursor-pointer icon-bw"
            src={loginIcon}
            alt={'Login'}
            onClick={() => {
              navigate('/auth');
              return;
            }}
          />
        )}
      </section>
    </header>
  );
};

export default Header;
