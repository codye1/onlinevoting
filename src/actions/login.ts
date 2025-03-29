import { loginFormSchema, loginFormState } from '../lib/definitions.ts';
import { store } from '../reducer/store.ts';
import { apiSlice } from '../reducer/api.ts';
import { authUser, setAuthLoading } from '../reducer/auth.ts';

type apiError = {
  data: {
    message: string;
  };
};

const login = async (_state: loginFormState, formData: FormData) => {
  store.dispatch(setAuthLoading(true));
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    store.dispatch(setAuthLoading(false));
    return {
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        auth: undefined,
      },
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const result = await store
      .dispatch(apiSlice.endpoints.login.initiate({ email, password }))
      .unwrap();

    // Обробка успішного результату
    localStorage.setItem('token', result.accessToken);
    console.log('Успішний вхід:', result);
    store.dispatch(setAuthLoading(false));
    store.dispatch(authUser({ email }));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'data' in error) {
      const err = error as apiError;
      console.error('Помилка входу:', err);
      store.dispatch(setAuthLoading(false));
      return {
        errors: {
          auth: [err.data.message],
          email: undefined,
          password: undefined,
        },
      };
    } else {
      console.error('Невідома помилка входу:', error);
      store.dispatch(setAuthLoading(false));
      return {
        errors: {
          auth: ['An unknown error occurred'],
          email: undefined,
          password: undefined,
        },
      };
    }
  }
};

export default login;
