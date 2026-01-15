import { useState } from 'react';
import Modal from '@components/Modal.tsx';
import TextInput from '@components/TextInput.tsx';
import MyButton from '@components/MyButton.tsx';

import {
  Category,
  inputTypes,
  PollResultsVisibility,
  PollType,
} from '@utils/types.ts';
import Description from './components/Description/Description.tsx';
import OptionsList from './components/OptionsList/OptionsList.tsx';
import Settings from './components/Settings/Settings.tsx';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPollValuesSchema } from '@utils/definitions.ts';
import { useAddPollMutation } from '@reducer/api.ts';
import type { AddPollRequest } from '@utils/types.ts';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import getErrorMessage from '@utils/getErrorMessage.ts';
import Errors from '@components/Errors.tsx';

const getRhfErrorMessage = (err: unknown): string | undefined => {
  if (!err || typeof err !== 'object') return undefined;
  const maybeMessage = (err as Record<string, unknown>).message;
  return typeof maybeMessage === 'string' ? maybeMessage : undefined;
};

const isRtkQueryError = (
  err: unknown,
): err is FetchBaseQueryError | SerializedError => {
  return typeof err === 'object' && err !== null;
};

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type OptionDraft = { file: string | null; title: string };

export type AddPollFormValues = {
  title: string;
  description: string;
  image: string;
  type: PollType;
  options: OptionDraft[];
  resultsVisibility: PollResultsVisibility;
  category: Category;
  changeVote: boolean;
  voteInterval: string;
  closePollOnDate: boolean;
  expireAtDate: Value;
};

interface IAddPollModal {
  handleClose: (reason: 'created' | 'closed') => void;
}

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

const AddPollModal = ({ handleClose }: IAddPollModal) => {
  const [addPoll, { isLoading }] = useAddPollMutation();
  const [apiErrors, setApiErrors] = useState<string[] | null>(null);

  const {
    control,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddPollFormValues>({
    resolver: zodResolver(addPollValuesSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      type: PollType.MULTIPLE,
      options: [
        { file: null, title: '' },
        { file: null, title: '' },
      ],
      resultsVisibility: PollResultsVisibility.ALWAYS,
      category: Category.NONE,
      changeVote: false,
      voteInterval: 'noInterval',
      closePollOnDate: false,
      expireAtDate: new Date(),
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: AddPollFormValues) => {
    clearErrors();
    setApiErrors(null);

    const expireAt = values.closePollOnDate
      ? pickDateFromPickerValue(values.expireAtDate)
      : undefined;
    console.log(values);

    const payload: AddPollRequest = {
      title: values.title,
      description: values.description.trim()
        ? values.description.trim()
        : undefined,
      image: values.image ?? '',
      type: values.type,
      options: values.options.map((opt) => ({
        title: opt.title,
        file: values.type === PollType.MULTIPLE ? null : opt.file,
      })),
      resultsVisibility: values.resultsVisibility,
      category: values.category,
      changeVote: values.changeVote,
      voteInterval: values.voteInterval,
      expireAt,
    };

    try {
      await addPoll(payload).unwrap();
      handleClose('created');
    } catch (e) {
      const msg = isRtkQueryError(e) ? getErrorMessage(e) : null;
      setApiErrors([msg ?? 'Unknown error']);
    }
  };

  const optionsSchemaMessage = getRhfErrorMessage(errors.options);

  return (
    <Modal close={() => handleClose('closed')}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'max-w-[815px] w-full'}
      >
        <Controller
          name={'title'}
          control={control}
          render={({ field }) => (
            <TextInput
              type={inputTypes.text}
              name={'title'}
              label={'Заголовок'}
              placeholder={'Напиши своє питання сюда'}
              trackValue={{
                value: field.value,
                onChange: (e) => field.onChange(e.target.value),
              }}
              errors={
                errors.title?.message ? [errors.title.message] : undefined
              }
            />
          )}
        />

        <Description
          control={control}
          descriptionError={
            errors.description?.message
              ? [errors.description.message]
              : undefined
          }
          image={watch('image')}
          setImage={(url) => setValue('image', url)}
        />

        <OptionsList
          control={control}
          clearErrors={clearErrors}
          optionSchemaErrorMessage={optionsSchemaMessage}
        />

        <Settings
          control={control}
          errors={
            errors.expireAtDate?.message
              ? [errors.expireAtDate.message]
              : undefined
          }
        />

        <MyButton
          className={'ml-auto'}
          type={'submit'}
          label={'Створити голосування'}
          isLoading={isLoading}
        />
        {apiErrors && <Errors errors={apiErrors} />}
      </form>
    </Modal>
  );
};

export default AddPollModal;
