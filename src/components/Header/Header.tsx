import { useLogoutMutation } from '@reducer/api/slices/authSlice.ts';
import logoutIcon from '@public/logout.svg';
import loginIcon from '@public/login.svg';
import { useAppSelector } from '@hooks/hooks';
import ThemeSwitcher from './ThemeSwitcher/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const onLogout = async () => {
    document.body.classList.add('loading');
    try {
      await logout().unwrap();
    } finally {
      document.body.classList.remove('loading');
    }
  };

  return (
    <header className="flex justify-between h-[50px] items-center text-2xl">
      <a
        className="font-extrabold cursor-pointer"
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
          <button className="bg-foreground rounded-xl p-1 flex relative shadow-m  cursor-pointer ml-1">
            <img
              title="Logout"
              className="w-[25px] h-[25px] cursor-pointer icon-bw"
              src={logoutIcon}
              alt={'Logout'}
              onClick={onLogout}
            />
          </button>
        ) : (
          <button className="bg-foreground rounded-xl p-1 flex relative shadow-m  cursor-pointer ml-1">
            <img
              title="Login"
              className="w-[25px] h-[25px] mr-[5px] icon-bw cursor-pointer"
              src={loginIcon}
              alt={'Login'}
              onClick={() => {
                navigate('/auth');
                return;
              }}
            />
          </button>
        )}
      </section>
    </header>
  );
};

export default Header;
