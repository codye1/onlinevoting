import TextInput from '@components/TextInput.tsx';
import MyButton from '@components/MyButton.tsx';
import { FormEvent, startTransition, useActionState } from 'react';
import signup from '@actions/signup.ts';
import { useAppSelector } from '@hooks/hooks.tsx';
import { inputTypes } from '@utils/types.ts';

interface SignupForm {
  onHaveAccount: () => void;
}

const Signup = ({ onHaveAccount }: SignupForm) => {
  const [state, action] = useActionState(signup, undefined);
  const isLoading = useAppSelector((state) => state.auth.authLoading);
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
      <h1 className={'text-2xl'}>Signup</h1>
      <TextInput
        placeholder={'email@example.com'}
        type={inputTypes.email}
        name={'email'}
        errors={state?.errors.email}
      />
      <TextInput
        placeholder={'Пароль'}
        type={inputTypes.password}
        name={'password'}
        errors={state?.errors.password}
      />
      <TextInput
        placeholder={'Пароль ще раз'}
        type={inputTypes.password}
        name={'confirmPassword'}
        errors={state?.errors.confirmPassword}
      />
      <p className={'text-start text-sm text-red-500 font-light'}>
        {state?.errors.auth}
      </p>
      <MyButton
        label={'Зареєструватися '}
        type={'submit'}
        isLoading={isLoading}
      />

      <p className={'mt-[30px] text-base font-light'}>
        Вже маєте акаунт?{' '}
        <strong className={'cursor-pointer'} onClick={onHaveAccount}>
          Вхід
        </strong>
      </p>
    </form>
  );
};

export default Signup;
