// features/auth/authApi.ts
import { apiSlice } from '../api';

export interface AuthResponse {
  accessToken: string;
}

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation<AuthResponse, { credential: string }>({
      query: (body) => ({
        url: 'auth/google',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (user) => ({
        url: 'login',
        method: 'POST',
        body: user,
      }),
    }),

    signup: builder.mutation<AuthResponse, { email: string; password: string }>(
      {
        query: (user) => ({
          url: 'register',
          method: 'POST',
          body: user,
        }),
      },
    ),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useRefreshMutation,
} = authSlice;

export default authSlice;
