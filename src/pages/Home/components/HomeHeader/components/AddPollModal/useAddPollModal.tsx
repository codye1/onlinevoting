import { zodResolver } from '@hookform/resolvers/zod';
import { addPollValuesSchema } from '@utils/definitions.ts';
import { useAddPollMutation } from '@reducer/api.ts';
import {
  Category,
  PollResultsVisibility,
  PollType,
  type AddPollRequest,
} from '@utils/types.ts';
import getErrorMessage from '@utils/getErrorMessage.ts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import getRhfErrorMessage from './lib/getRhfErrorMessage';
import isRtkQueryError from './lib/isRtkQueryError';
import pickDateFromPickerValue from './lib/pickDateFromPickerValue';
import { AddPollFormValues } from './lib/types';

const useAddPollModal = (
  handleClose: (reason: 'created' | 'closed') => void,
) => {
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

  return {
    form: {
      control,
      errors,
      watch,
      setValue,
      clearErrors,
      handleSubmit,
      onSubmit,
    },
    isLoading,
    apiErrors,
    optionsSchemaMessage,
  };
};

export default useAddPollModal;
