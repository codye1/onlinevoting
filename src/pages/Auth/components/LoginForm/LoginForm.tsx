import MyButton from '@components/MyButton.tsx';
import login from '@actions/login.ts';
import { FormEvent, startTransition, useActionState } from 'react';
import { useAppSelector } from '@hooks/hooks.tsx';
import TextInput from '@components/TextInput.tsx';
import { inputTypes } from '@utils/types.ts';
import Errors from '@components/Errors';

interface LoginForm {
  onHaveAccount: () => void;
}

const LoginForm = ({ onHaveAccount }: LoginForm) => {
  const [state, action] = useActionState(login, undefined);
  const isLoading = useAppSelector((state) => state.auth.authLoading);

  console.log('state', state);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        'shadow-m bg-foreground text-xl p-10 rounded-sm flex text-center justify-center flex-col max-w-100 m-auto '
      }
    >
      <h1 className={'text-2xl'}>Login</h1>
      <TextInput
        name={'email'}
        placeholder={'email@example.com'}
        type={inputTypes.email}
        errors={state?.errors.email}
      />
      <TextInput
        name={'password'}
        placeholder={'Пароль'}
        type={inputTypes.password}
        errors={state?.errors.password}
      />
      {state?.errors.auth && <Errors errors={state.errors.auth} />}
      <MyButton type={'submit'} label={'Вхід'} isLoading={isLoading} />

      <p className={'mt-[30px] text-base font-light'}>
        Ще не маєте облікового запису?{' '}
        <strong
          className={'cursor-pointer text-shadow-m'}
          onClick={onHaveAccount}
        >
          Зареєструйтесь
        </strong>
      </p>
    </form>
  );
};

export default LoginForm;
