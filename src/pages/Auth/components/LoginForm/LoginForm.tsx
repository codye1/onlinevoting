import MyButton from '../../../../components/MyButton.tsx';
import login from '../../../../actions/login.ts';
import { FormEvent, startTransition, useActionState } from 'react';
import { useAppSelector } from '../../../../hooks/hooks.tsx';
import TextInput from '../../../../components/TextInput.tsx';
import { types } from '../../../../lib/types.ts';

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
        'bg-[#1E1E1E] text-xl p-10 rounded-sm flex text-center justify-center flex-col max-w-100 m-auto'
      }
    >
      <h1 className={'text-2xl'}>Login</h1>
      <TextInput
        name={'email'}
        placeholder={'email@example.com'}
        type={types.email}
        errors={state?.errors.email}
      />
      <TextInput
        name={'password'}
        placeholder={'password'}
        type={types.password}
        errors={state?.errors.password}
      />
      <p className={'text-start text-sm text-red-500 text-sm font-light'}>
        {state?.errors.auth}
      </p>
      <MyButton type={'submit'} label={'Вхід'} isLoading={isLoading} />

      <p className={'mt-[30px] text-base font-light'}>
        Ще не маєте облікового запису?{' '}
        <strong className={'cursor-pointer'} onClick={onHaveAccount}>
          Зареєструйтесь
        </strong>
      </p>
    </form>
  );
};

export default LoginForm;
