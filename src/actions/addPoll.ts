
import { addPollFormSchema } from '@utils/definitions.ts';
import { store } from '../reducer/store.ts';
import { apiSlice } from '../reducer/api.ts';
import { Poll } from '@utils/types.ts';
type apiError = {
  data: {
    message: string;
  };
};

type AddPollOptions = string[] | { file: string; title: string }[];

export interface AddPoll extends Omit<Poll, 'options' | 'creator'> {
  creator?: string;
  options: AddPollOptions;
}

const addPoll =
  (closeModal: () => void, setIsLoading: (v: boolean) => void) =>
  async (_: unknown, formData: FormData) => {
    setIsLoading(true);

    try {
      const parsed = addPollFormSchema.safeParse(formData);

      if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
      }

      await store.dispatch(
        apiSlice.endpoints.addPoll.initiate(parsed.data),
      ).unwrap();

      closeModal();
    } catch (e) {
      return handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  };



export default addPoll;

const handleApiError = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error
  ) {
    return {
      errors: {
        api: [(error as apiError).data.message],
      },
    };
  }

  return {
    errors: {
      api: ['Unknown error'],
    },
  };
};


