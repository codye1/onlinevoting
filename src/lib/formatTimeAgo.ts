export const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} second${diff === 1 ? '' : 's'} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
};
