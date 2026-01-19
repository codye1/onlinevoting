const getRhfErrorMessage = (err: unknown): string | undefined => {
  if (!err || typeof err !== 'object') return undefined;
  const maybeMessage = (err as Record<string, unknown>).message;
  return typeof maybeMessage === 'string' ? maybeMessage : undefined;
};

export default getRhfErrorMessage;
