import { FieldError } from 'react-hook-form';

const collectRhfMessages = (err: unknown, out: string[] = []): string[] => {
  if (!err || typeof err !== 'object') return out;

  const maybeFieldError = err as Partial<FieldError>;
  if (typeof maybeFieldError.message === 'string') {
    // react-hook-form default message; prefer our zod messages instead of this noise
    if (maybeFieldError.message !== 'Required') {
      out.push(maybeFieldError.message);
    }
  }

  for (const value of Object.values(err as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      value.forEach((v) => collectRhfMessages(v, out));
    } else if (value && typeof value === 'object') {
      collectRhfMessages(value, out);
    }
  }

  return out;
};

export default collectRhfMessages;
