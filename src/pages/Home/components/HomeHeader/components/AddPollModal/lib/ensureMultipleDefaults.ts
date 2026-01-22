import { AddPollOptionDraft } from '@utils/types';

const ensureMultipleDefaults = (options: AddPollOptionDraft[]) => {
  if (options.length >= 2) return options;
  if (options.length === 1) return [...options, { file: null, title: '' }];
  return [
    { file: null, title: '' },
    { file: null, title: '' },
  ];
};

export default ensureMultipleDefaults;
