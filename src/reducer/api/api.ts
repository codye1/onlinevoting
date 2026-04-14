import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import getErrorCode from '@utils/getErrorCode';

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
  const { default: authSlice } = await import('./slices/authSlice');
  const code = getErrorCode(result.error);
  const isUnauthorized =
    code === 'TOKEN_EXPIRED' && result.error?.status === 401;
  console.log(code);
  console.log(result.error);
  if (isUnauthorized) {
    await api.dispatch(authSlice.endpoints.refresh.initiate());
    result = await baseQuery(args, api, extraOptions);
  }
  return result;
};

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default apiSlice;
