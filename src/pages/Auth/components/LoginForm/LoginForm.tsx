import TextInput, { types } from '../../../../components/TextInput.tsx';
import MyButton from '../../../../components/MyButton.tsx';

interface LoginForm {
  onHaveAccount: () => void;
}

const LoginForm = ({ onHaveAccount }: LoginForm) => {
  return (
    <form
      className={
        'bg-[#1E1E1E] text-xl p-10 rounded-sm flex text-center justify-center flex-col max-w-100 m-auto'
      }
    >
      <h1 className={'text-2xl'}>Login</h1>
      <TextInput placeholder={'email@example.com'} type={types.email} />
      <TextInput placeholder={'password'} type={types.password} />
      <MyButton label={'Вхід'} />
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
