import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

type RefreshResponse = {
  accessToken: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
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

  const error = result.error;
  const isUnauthorized =
    !!error &&
    ((typeof error.status === 'number' &&
      (error.status === 401 || error.status === 403)) ||
      (error.status === 'PARSING_ERROR' &&
        (error as unknown as { originalStatus?: number }).originalStatus ===
          401));

  if (isUnauthorized) {
    const refreshResult = await baseQuery(
      {
        url: 'refresh',
        method: 'POST',
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as RefreshResponse;
      localStorage.setItem('token', data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem('token');
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
