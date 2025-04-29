import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './auth.ts';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Poll } from '../actions/addPoll.ts';

interface AuthResponce {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/',
  prepareHeaders: (headers) => {
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    console.log(localStorage.getItem('token'));
    console.log(headers.get('Authorization'));
    return headers;
  },
  credentials: 'include',
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);
  if (result.error && result.error.status === 'PARSING_ERROR') {
    const refreshResult = await baseQuery('refresh', api, extraOptions);
    if (refreshResult.data) {
      // Не міг дати AuthResponse для refreshResult.data, тому зробив так
      console.log(refreshResult.data);
      const data: AuthResponce = JSON.parse(JSON.stringify(refreshResult.data));
      //document.cookie = `refreshToken=${data.refreshToken}; domain=sushi-shop-pet-project-m7t7.vercel.app; path=/; SameSite=None; Secure; max-age=${30 * 24 * 60 * 60 * 1000}; `;
      localStorage.setItem('token', data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    login: builder.mutation<AuthResponce, { email: string; password: string }>({
      query: (user) => ({
        url: 'auth/login',
        method: 'POST',
        params: { email: user.email, password: user.password },
      }),
    }),
    signup: builder.mutation<AuthResponce, { email: string; password: string }>(
      {
        query: (user) => ({
          url: 'auth/register',
          method: 'POST',
          body: { ...user },
        }),
      },
    ),
    addPoll: builder.mutation<AuthResponce, Poll>({
      query: (poll) => ({
        url: 'polls',
        method: 'POST',
        body: { ...poll },
      }),
    }),
    refresh: builder.query<AuthResponce, void>({
      query: () => 'auth/refresh',
    }),
  }),
});

export const { useGetUsersQuery, useLoginMutation, useRefreshQuery } = apiSlice;
