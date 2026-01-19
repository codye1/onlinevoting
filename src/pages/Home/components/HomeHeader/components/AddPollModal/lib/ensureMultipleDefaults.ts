import { OptionDraft } from './types';

const ensureMultipleDefaults = (options: OptionDraft[]) => {
  if (options.length >= 2) return options;
  if (options.length === 1) return [...options, { file: null, title: '' }];
  return [
    { file: null, title: '' },
    { file: null, title: '' },
  ];
};

export default ensureMultipleDefaults;
