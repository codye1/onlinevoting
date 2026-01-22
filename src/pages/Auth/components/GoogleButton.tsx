import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@reducer/api/slices/authSlice.ts';
const GoogleButton = () => {
  const [googleLogin] = useGoogleLoginMutation();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        await googleLogin({
          credential: res.credential!,
        }).unwrap();
      }}
      onError={() => console.log('Google login failed')}
    />
  );
};

export default GoogleButton;
