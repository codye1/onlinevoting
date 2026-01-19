import { Value } from './types';

const pickDateFromPickerValue = (value: Value): Date | undefined => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (Array.isArray(value)) {
    const maybeDates = value.filter(
      (v): v is Date => v instanceof Date && !Number.isNaN(v.getTime()),
    );
    return maybeDates.length > 0
      ? maybeDates[maybeDates.length - 1]
      : undefined;
  }
  return undefined;
};

export default pickDateFromPickerValue;
