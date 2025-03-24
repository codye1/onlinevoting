import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './auth.ts';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetUserByIdQuery, useGetUsersQuery } = apiSlice;
