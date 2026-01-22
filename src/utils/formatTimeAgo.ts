type RelativeUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export const formatTimeAgo = (
  timestamp: string,
  locale: string = 'uk-UA',
): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const pickUnit = (): { unit: RelativeUnit; value: number } => {
    if (absSeconds < 60) return { unit: 'second', value: diffSeconds };

    const diffMinutes = Math.round(diffSeconds / 60);
    const absMinutes = Math.abs(diffMinutes);
    if (absMinutes < 60) return { unit: 'minute', value: diffMinutes };

    const diffHours = Math.round(diffMinutes / 60);
    const absHours = Math.abs(diffHours);
    if (absHours < 24) return { unit: 'hour', value: diffHours };

    const diffDays = Math.round(diffHours / 24);
    const absDays = Math.abs(diffDays);
    if (absDays < 7) return { unit: 'day', value: diffDays };

    const diffWeeks = Math.round(diffDays / 7);
    const absWeeks = Math.abs(diffWeeks);
    if (absWeeks < 4) return { unit: 'week', value: diffWeeks };

    const diffMonths = Math.round(diffDays / 30);
    const absMonths = Math.abs(diffMonths);
    if (absMonths < 12) return { unit: 'month', value: diffMonths };

    const diffYears = Math.round(diffDays / 365);
    return { unit: 'year', value: diffYears };
  };

  const { unit, value } = pickUnit();
  return rtf.format(value, unit);
};
