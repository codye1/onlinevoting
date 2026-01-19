import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const isRtkQueryError = (
  err: unknown,
): err is FetchBaseQueryError | SerializedError => {
  return typeof err === 'object' && err !== null;
};

export default isRtkQueryError;
