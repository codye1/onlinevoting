import { AddPollRequest, Poll, PollOption } from '@utils/types';
import { apiSlice } from '../api';
import { IPollItem } from '@components/PollsList/PollItem';
import { QueryParams } from 'src/pages/Home/Home';
import { Vote } from 'src/pages/Poll/Poll';

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

const pollSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addPoll: builder.mutation<null, AddPollRequest>({
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
    getPolls: builder.query<PollsResponse<IPollItem>, QueryParams>({
      query: (params) => ({
        url: 'polls',
        method: 'GET',
        params,
        responseHandler: async (response) => {
          const text = await response.text();
          return text ? (JSON.parse(text) as unknown) : null;
        },
      }),
      transformResponse: (response: PollsResponse<IPollItem> | null) => ({
        polls: response?.polls ?? [],
        nextCursor: response?.nextCursor ?? null,
        hasMore: response?.hasMore ?? false,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Do not include `cursor` in the cache key: keep one cache entry per filter/search combo.
        return `${endpointName}|${queryArgs.filter}|${queryArgs.pageSize}|${queryArgs.search}|${queryArgs.category}|${queryArgs.sortByVotes ?? ''}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),
    vote: builder.mutation<null, Vote>({
      query: (vote) => ({
        url: `/polls/${vote.pollId}/votes`,
        method: 'POST',
        body: { ...vote },
      }),
    }),
  }),
});

export const {
  useAddPollMutation,
  useGetPollResultsQuery,
  useGetPollQuery,
  useGetPollsQuery,
  useVoteMutation,
} = pollSlice;

export default pollSlice;
