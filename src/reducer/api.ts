import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './auth.ts';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { Vote } from '../pages/Poll/Poll.tsx';
import { PollItem } from '@components/PollsList.tsx';
import { Poll, PollOption } from '../utils/types.ts';
import { AddPoll } from '../actions/addPoll.ts';
import { QueryParams } from 'src/pages/Home/Home.tsx';

interface PollResponse extends Poll {
  id: string;
  createdAt: string;
  userVote: PollOption | null;
}

interface PollResultsOption extends PollOption {
  votes: number;
}

export interface PollResultsResponse {
  id: string;
  creatorEmail: string;
  title: string;
  type: string;
  createdAt: string;

  options: PollResultsOption[];
}

export interface Pagination {
  totalItems: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
}

export interface PollsResponse<T> {
  polls: T[];
  nextCursor: string | null;
  hasMore: boolean;
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
      const data = refreshResult.data as AuthResponce;
      localStorage.setItem('token', data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem('token');
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
        url: 'login',
        method: 'POST',
        body: { ...user },
      }),
    }),
    signup: builder.mutation<AuthResponce, { email: string; password: string }>(
      {
        query: (user) => ({
          url: 'register',
          method: 'POST',
          body: { ...user },
        }),
      },
    ),
    addPoll: builder.mutation<AuthResponce, AddPoll>({
      query: (poll) => ({
        url: 'polls',
        method: 'POST',
        body: { ...poll },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
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
    getPolls: builder.query<PollsResponse<PollItem>, QueryParams>({
      query: (params) => ({
        url: 'polls',
        method: 'GET',
        params,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),
    vote: builder.mutation<AuthResponce, Vote>({
      query: (vote) => ({
        url: `/polls/${vote.pollId}/votes`,
        method: 'POST',
        body: { ...vote },
      }),
    }),
    refresh: builder.mutation<AuthResponce, void>({
      query: () => ({
        url: 'refresh',
        method: 'POST',
      }),
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
  useRefreshMutation,
  useUploadImagesToImgBBMutation,
  useLogoutMutation,
} = apiSlice;
