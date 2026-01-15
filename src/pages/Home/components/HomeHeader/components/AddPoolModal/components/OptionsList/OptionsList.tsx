import { PollType } from '@utils/types.ts';
import { useEffect, useState } from 'react';
import DropDown from '@components/DropDown.tsx';
import { typeOptions } from '../../../../../../constants.ts';
import Errors from '@components/Errors.tsx';
import MultipleOptions from './components/MultipleOptions.tsx';
import ImageOptions from './components/ImageOptions.tsx';

interface IOptionsList {
  optionsErrors?: string[];
}

export type OptionDraft = { file: string | null; title: string };

const OptionsList = ({ optionsErrors }: IOptionsList) => {
  const [typePoll, setTypePoll] = useState<PollType>(PollType.MULTIPLE);

  const [options, setOptions] = useState<OptionDraft[]>([]);

  useEffect(() => {
    setOptions((prev) => {
      if (typePoll === PollType.MULTIPLE) {
        if (prev.length == 0) {
          return [
            { file: null, title: '' },
            { file: null, title: '' },
          ];
        }
        if (prev.length === 1) {
          return [...prev, { file: null, title: '' }];
        }
      }
      if (typePoll === PollType.IMAGE) {
        setOptions([]);
      }
      return prev;
    });
  }, [typePoll]);

  return (
    <>
      <DropDown
        className={'w-1/4'}
        name={'type'}
        options={typeOptions}
        value={typePoll}
        onSelect={(value) => {
          setTypePoll(value as PollType);
        }}
      />

      <fieldset>
        <h1 className={'m-[5px]'}>Варіанти</h1>

        {typePoll === PollType.MULTIPLE && (
          <MultipleOptions options={options} setOptions={setOptions} />
        )}
        {typePoll === PollType.IMAGE && (
          <ImageOptions options={options} setOptions={setOptions} />
        )}

        {optionsErrors && <Errors errors={optionsErrors} />}

        <input type="hidden" name="options" value={JSON.stringify(options)} />
      </fieldset>
    </>
  );
};

export default OptionsList;
