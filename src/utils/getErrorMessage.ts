import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

const getErrorMessage = (
  err?: FetchBaseQueryError | SerializedError,
): string | null => {
  if (!err) return null;
  if (
    'data' in err &&
    err.data &&
    typeof err.data === 'object' &&
    'message' in err.data
  ) {
    return (err.data as { message: string }).message;
  }
  if ('message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return 'An error occurred';
};

export default getErrorMessage;
