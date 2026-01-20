import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@reducer/api.ts';
import { authUser, setAuthLoading } from '@reducer/auth.ts';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '@hooks/hooks.tsx';
import { DecodedToken } from 'src/App.tsx';

const GoogleButton = () => {
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        const result = await googleLogin({
          credential: res.credential!,
        }).unwrap();

        localStorage.setItem('token', result.accessToken);
        const decoded = jwtDecode<DecodedToken>(result.accessToken);
        dispatch(setAuthLoading(false));
        dispatch(authUser({ id: decoded.userId, email: decoded.email }));
      }}
      onError={() => console.log('Google login failed')}
    />
  );
};

export default GoogleButton;
