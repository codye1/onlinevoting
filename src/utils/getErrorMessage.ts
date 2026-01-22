import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

const getErrorMessage = (
  err?: FetchBaseQueryError | SerializedError,
): string | null => {
  if (!err) return null;

  // FetchBaseQueryError may contain a plain string in `error`
  if ('error' in err && typeof err.error === 'string' && err.error) {
    return err.error;
  }

  // FetchBaseQueryError may contain a plain string in `data`
  if ('data' in err && typeof err.data === 'string' && err.data) {
    return err.data;
  }

  if (
    'data' in err &&
    err.data &&
    typeof err.data === 'object' &&
    'message' in err.data
  ) {
    return (err.data as { message: string }).message;
  }

  if (
    'data' in err &&
    err.data &&
    typeof err.data === 'object' &&
    'error' in err.data &&
    typeof (err.data as { error?: unknown }).error === 'string'
  ) {
    return (err.data as { error: string }).error;
  }

  if ('message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return 'An error occurred';
};

export default getErrorMessage;
