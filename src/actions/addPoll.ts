import { addPollFormSchema, addPollFormState } from '../lib/definitions.ts';
import { store } from '../reducer/store.ts';
import { apiSlice } from '../reducer/api.ts';
import { setButtonLoading } from '../reducer/general.tsx';

type apiError = {
  data: {
    message: string;
  };
};

export interface Poll {
  title: string;
  description?: string;
  options: string[];
  creator: string;
  type: string;
  visibility: string;
  date?: Date;
}

const addPool = async (_state: addPollFormState, formData: FormData) => {
  store.dispatch(setButtonLoading(true));
  // Parse options from the hidden input
  const optionsString = formData.get('options')?.toString() || '[]';
  const options = JSON.parse(optionsString) as string[];

  // Validate form data
  const validatedFields = addPollFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    visibility: formData.get('visibility'),
    options,
    date:
      formData.get('closePollOnDate') === 'true'
        ? new Date(formData.get('date') as string)
        : undefined,
  });
  console.log(validatedFields.error);
  if (!validatedFields.success) {
    store.dispatch(setButtonLoading(false));
    return {
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  const {
    title,
    description,
    options: validOptions,
    date,
  } = validatedFields.data;

  console.log('Validated data:', {
    title,
    description,
    options: validOptions,
    date,
  });
  try {
    const result = await store
      .dispatch(
        apiSlice.endpoints.addPoll.initiate({
          ...validatedFields.data,
          creator: store.getState().auth.user.email,
        }),
      )
      .unwrap();
    console.log(result);
    window.location.reload();
    store.dispatch(setButtonLoading(false));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'data' in error) {
      const err = error as apiError;
      console.error('Помилка :', err);
      store.dispatch(setButtonLoading(false));
      return {
        errors: {
          api: [err.data.message],
          title: undefined,
          description: undefined,
          type: undefined,
          visibility: undefined,
          date: undefined,
          options: undefined,
        },
      };
    } else {
      console.error('Невідома помилка :', error);
      store.dispatch(setButtonLoading(false));
      return {
        errors: {
          api: ['An unknown error occurred'],
          title: undefined,
          description: undefined,
          type: undefined,
          visibility: undefined,
          date: undefined,
          options: undefined,
        },
      };
    }
  }
};

export default addPool;
