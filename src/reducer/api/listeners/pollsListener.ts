import { addToastWithTimeout } from '@reducer/toasts';
import { nanoid } from '@reduxjs/toolkit';
import { AppStartListening } from '../listenerMiddleware';
import pollSlice from '../slices/pollSlice';

export const addPollListeners = (startAppListening: AppStartListening) => {
  // ADD POLL SUCCESS
  startAppListening({
    matcher: pollSlice.endpoints.addPoll.matchFulfilled,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Ви успішно додали опитування',
        type: 'success',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // ADD POLL ERROR
  startAppListening({
    matcher: pollSlice.endpoints.addPoll.matchRejected,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Не вдалося додати опитування.',
        type: 'error',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // VOTE SUCCESS
  startAppListening({
    matcher: pollSlice.endpoints.vote.matchFulfilled,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Ви успішно проголосували',
        type: 'success',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // VOTE ERROR
  startAppListening({
    matcher: pollSlice.endpoints.vote.matchRejected,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: nanoid(),
        message: 'Не вдалося проголосувати.',
        type: 'error',
        duration: 1500,
      })(api.dispatch);
    },
  });
};
