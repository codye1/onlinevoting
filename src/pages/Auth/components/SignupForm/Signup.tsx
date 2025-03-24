import TextInput, { types } from '../../../../components/TextInput.tsx';
import MyButton from '../../../../components/MyButton.tsx';

interface SignupForm {
  onHaveAccount: () => void;
}

const Signup = ({ onHaveAccount }: SignupForm) => {
  return (
    <form
      className={
        'bg-[#1E1E1E] text-xl p-10 rounded-sm flex text-center justify-center flex-col max-w-100 m-auto'
      }
    >
      <h1 className={'text-2xl'}>Signup</h1>
      <TextInput placeholder={'email@example.com'} type={types.email} />
      <TextInput placeholder={'password'} type={types.password} />
      <TextInput placeholder={'confirm password'} type={types.password} />
      <MyButton label={'Зареєструватися '} />

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
