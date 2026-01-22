import { addToastWithTimeout } from '@reducer/toasts';
import { logoutUser } from '@reducer/auth';
import { nanoid, isAnyOf } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authUser } from '@reducer/auth';
import type { ListenerEffectAPI } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import type { AppStartListening } from '../listenerMiddleware';
import type { AppDispatch, RootState } from '@reducer/store';

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const handleAuthSuccess = (
  accessToken: string,
  api: ListenerEffectAPI<RootState, AppDispatch>,
) => {
  localStorage.setItem('token', accessToken);

  const decoded = jwtDecode<DecodedToken>(accessToken);
  api.dispatch(authUser({ id: decoded.userId, email: decoded.email }));
};

export const addAuthListeners = (startAppListening: AppStartListening) => {
  // LOGIN / SIGNUP / GOOGLE SUCCESS
  startAppListening({
    matcher: isAnyOf(
      authSlice.endpoints.login.matchFulfilled,
      authSlice.endpoints.signup.matchFulfilled,
      authSlice.endpoints.googleLogin.matchFulfilled,
    ),
    effect: async (action, api) => {
      handleAuthSuccess(
        (action.payload as { accessToken: string }).accessToken,
        api,
      );

      addToastWithTimeout({
        id: nanoid(),
        message: 'Ви успішно увійшли в систему',
        type: 'success',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // LOGIN / SIGNUP / GOOGLE ERROR
  startAppListening({
    matcher: isAnyOf(
      authSlice.endpoints.login.matchRejected,
      authSlice.endpoints.signup.matchRejected,
      authSlice.endpoints.googleLogin.matchRejected,
    ),
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Помилка авторизації',
        type: 'error',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // LOGOUT SUCCESS
  startAppListening({
    matcher: authSlice.endpoints.logout.matchFulfilled,
    effect: async (_action, api) => {
      localStorage.removeItem('token');
      api.dispatch(logoutUser());

      addToastWithTimeout({
        id: nanoid(),
        message: 'Ви успішно вийшли з системи',
        type: 'success',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // LOGOUT ERROR
  startAppListening({
    matcher: authSlice.endpoints.logout.matchRejected,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Не вдалося вийти з системи',
        type: 'error',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // REFRESH
  startAppListening({
    matcher: authSlice.endpoints.refresh.matchFulfilled,
    effect: async (action, api) => {
      handleAuthSuccess(
        (action.payload as { accessToken: string }).accessToken,
        api,
      );
    },
  });

  startAppListening({
    matcher: authSlice.endpoints.refresh.matchRejected,
    effect: async () => {
      localStorage.removeItem('token');
    },
  });
};
