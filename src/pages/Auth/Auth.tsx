import LoginForm from './components/LoginForm/LoginForm.tsx';
import { useState } from 'react';
import Signup from './components/SignupForm/Signup.tsx';

const Auth = () => {
  const [haveAccount, setHaveAccount] = useState<boolean>(true);

  return (
    <menu>
      {haveAccount ? (
        <LoginForm
          onHaveAccount={() => {
            setHaveAccount(false);
          }}
        />
      ) : (
        <Signup
          onHaveAccount={() => {
            setHaveAccount(true);
          }}
        />
      )}
    </menu>
  );
};

export default Auth;
