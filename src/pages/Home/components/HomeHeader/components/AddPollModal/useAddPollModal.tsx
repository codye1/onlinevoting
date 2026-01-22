import { zodResolver } from '@hookform/resolvers/zod';
import { addPollValuesSchema } from '@utils/definitions.ts';
import { useAddPollMutation } from '@reducer/api/slices/pollSlice.ts';
import {
  Category,
  PollResultsVisibility,
  PollType,
  type AddPollRequest,
} from '@utils/types.ts';
import getErrorMessage from '@utils/getErrorMessage.ts';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import getRhfErrorMessage from './lib/getRhfErrorMessage';
import isRtkQueryError from './lib/isRtkQueryError';

const STORAGE_KEY = 'addPollFormData';

const defaultValues: AddPollRequest = {
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
  voteInterval: 'noInterval',
  changeVote: false,
  expireAt: null,
};

const getDefaultValues = (): AddPollRequest => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultValues;
    const parsed = JSON.parse(stored);
    return parsed;
  } catch {
    return defaultValues;
  }
};

const useAddPollModal = (
  handleClose: (reason: 'created' | 'closed') => void,
) => {
  const [addPoll, { isLoading }] = useAddPollMutation();
  const [apiErrors, setApiErrors] = useState<string[] | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  };
  const {
    control,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddPollRequest>({
    resolver: zodResolver(addPollValuesSchema),
    defaultValues: getDefaultValues(),
    mode: 'onSubmit',
  });

  const onSubmit = async (values: AddPollRequest) => {
    clearErrors();
    setApiErrors(null);
    cancelPendingSave();
    try {
      await addPoll(values).unwrap();
      handleClose('created');

      cancelPendingSave();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValues));
      reset(defaultValues);
    } catch (e) {
      const msg = isRtkQueryError(e) ? getErrorMessage(e) : null;
      setApiErrors([msg ?? 'Unknown error']);
    }
  };

  const optionsSchemaMessage = getRhfErrorMessage(errors.options);

  useEffect(() => {
    const subscription = watch((values) => {
      cancelPendingSave();

      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      cancelPendingSave();
    };
  }, [watch]);

  return {
    form: {
      control,
      errors,
      watch,
      setValue,
      clearErrors,
      handleSubmit,
      onSubmit,
      reset,
    },
    isLoading,
    apiErrors,
    optionsSchemaMessage,
  };
};

export default useAddPollModal;
