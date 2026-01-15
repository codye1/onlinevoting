import { useEffect } from 'react';
import DropDown from '@components/DropDown.tsx';
import Error from '@components/Error.tsx';
import Errors from '@components/Errors.tsx';
import { typeOptions } from '../../../../../../constants.ts';
import { PollType } from '@utils/types.ts';
import {
  Control,
  Controller,
  type UseFormClearErrors,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import type { AddPollFormValues, OptionDraft } from '../../AddPollModal.tsx';
import MultipleOptions from './components/MultipleOptions.tsx';
import ImageOptions from './components/ImageOptions.tsx';

interface IOptionsList {
  control: Control<AddPollFormValues>;
  clearErrors: UseFormClearErrors<AddPollFormValues>;
  optionsErrors?: string[];
  optionSchemaErrorMessage?: string;
}

const ensureMultipleDefaults = (options: OptionDraft[]) => {
  if (options.length >= 2) return options;
  if (options.length === 1) return [...options, { file: null, title: '' }];
  return [
    { file: null, title: '' },
    { file: null, title: '' },
  ];
};

const OptionsList = ({
  control,
  clearErrors,
  optionsErrors,
  optionSchemaErrorMessage,
}: IOptionsList) => {
  const typePoll = useWatch({ control, name: 'type' });
  const optionsValue = useWatch({ control, name: 'options' }) ?? [];

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'options',
  });

  useEffect(() => {
    // When poll type changes we rebuild the field array; clear stale errors
    // (e.g. options.3.title) that would otherwise stick around.
    clearErrors('options');

    if (typePoll === PollType.MULTIPLE) {
      const normalized = ensureMultipleDefaults(optionsValue).map((o) => ({
        ...o,
        file: null,
      }));
      replace(normalized);
    }
    if (typePoll === PollType.IMAGE) {
      replace([]);
    }
  }, [typePoll, clearErrors]);

  return (
    <>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <DropDown
            className={'w-1/4'}
            name={'type'}
            options={typeOptions}
            value={field.value}
            onSelect={(value) => field.onChange(value as PollType)}
          />
        )}
      />

      <fieldset>
        <h1 className={'m-[5px]'}>Варіанти</h1>

        {typePoll === PollType.MULTIPLE && (
          <MultipleOptions
            control={control}
            fields={fields}
            append={append}
            remove={remove}
          />
        )}

        {typePoll === PollType.IMAGE && (
          <ImageOptions
            control={control}
            fields={fields}
            append={append}
            remove={remove}
          />
        )}

        {optionsErrors && <Errors errors={optionsErrors} />}
        {optionSchemaErrorMessage && <Error error={optionSchemaErrorMessage} />}
      </fieldset>
    </>
  );
};

export default OptionsList;
