import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './auth.ts';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Poll } from '../actions/addPoll.ts';
import { Vote } from '../pages/Poll/Poll.tsx';
import { PollItem } from '../components/PollsList.tsx';

interface PollResponse {
  id: string;
  creator: string;
  title: string;
  image: string;
  description: string;
  visibility: string;
  type: string;
  startDate: string;
  endDate: string;
  userVote: number;
  options: { file: string; title: string }[] | string[];
}

interface PollResultsResponse {
  id: string;
  creator: string;
  title: string;
  type: string;
  startDate: string;
  options:
    | { title: string; file: string; votes: number }[]
    | { title: string; votes: number }[];
}

export interface Pagination {
  totalItems: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
}

export interface PollsResponse {
  pagination: Pagination;
  polls: PollItem[];
}

interface AuthResponce {
  accessToken: string;
}

interface ImgBBResponse {
  data: {
    url: string;
  };
  success: boolean;
  status: number;
}

// ImgBB API key (replace with your actual key)
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

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
      console.log(refreshResult.data);
      const data: AuthResponce = JSON.parse(JSON.stringify(refreshResult.data));
      localStorage.setItem('token', data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

// Separate base query for ImgBB (no auth, different base URL)
const imgBBBaseQuery = fetchBaseQuery({
  baseUrl: 'https://api.imgbb.com/1/',
});

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
    getPoll: builder.query<PollResponse, { pollId: string }>({
      query: ({ pollId }) => `/polls/${pollId}`,
      transformResponse: (response: { poll: PollResponse }) => response.poll,
    }),
    getPollResults: builder.query<PollResultsResponse, { pollId: string }>({
      query: ({ pollId }) => `/polls/${pollId}/results`,
      transformResponse: (response: { poll: PollResultsResponse }) =>
        response.poll,
    }),
    getPolls: builder.query<
      PollsResponse,
      {
        filter: string;
        page: number;
        size: number;
        search: string;
        category: string;
        sortByVotes?: 'asc' | 'desc';
      }
    >({
      query: (params) => ({
        url: 'polls',
        method: 'GET',
        params: { ...params },
      }),
    }),
    vote: builder.mutation<AuthResponce, Vote>({
      query: (vote) => ({
        url: 'votes',
        method: 'POST',
        body: { ...vote },
      }),
    }),
    refresh: builder.query<AuthResponce, void>({
      query: () => 'auth/refresh',
    }),
    uploadImagesToImgBB: builder.mutation<string[], File[]>({
      queryFn: async (files: File[], _api, _extraOptions) => {
        try {
          const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('key', IMGBB_API_KEY);
            formData.append('image', file);
            formData.append('name', file.name);

            const response = await imgBBBaseQuery(
              {
                url: 'upload',
                method: 'POST',
                body: formData,
              },
              _api,
              _extraOptions,
            );

            if (response.error) {
              throw new Error(
                `Failed to upload ${file.name}: ${response.error}`,
              );
            }

            const data = response.data as ImgBBResponse;
            if (!data.success) {
              throw new Error(
                `Failed to upload ${file.name}: API returned unsuccessful response`,
              );
            }

            return data.data.url;
          });

          const urls = await Promise.all(uploadPromises);
          return { data: urls };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Unknown error during image upload',
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLoginMutation,
  useGetPollResultsQuery,
  useGetPollQuery,
  useGetPollsQuery,
  useVoteMutation,
  useRefreshQuery,
  useUploadImagesToImgBBMutation,
} = apiSlice;
