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
  image: string;
  options: string[] | { file: string; title: string }[];
  creator: string;
  type: string;
  visibility: string;
  date?: Date;
}

const addPool = async (_state: addPollFormState, formData: FormData) => {
  store.dispatch(setButtonLoading(true));

  // Parse type and options/images from formData
  const type = formData.get('type')?.toString();
  let options: string[] | { file: string; title: string }[] = [];

  if (type === 'multiple') {
    // Parse options for multiple choice poll
    const optionsString = formData.get('options')?.toString() || '[]';
    try {
      options = JSON.parse(optionsString) as string[];
    } catch (e) {
      store.dispatch(setButtonLoading(false));
      return {
        errors: {
          options: ['Invalid options format.'],
        },
      };
    }
  } else if (type === 'img') {
    // Parse images for image poll
    const uploadedImages: { file: string; title: string }[] = [];
    let index = 0;

    // Iterate through formData to find image URLs and titles
    while (formData.has(`image-${index}`)) {
      const file = formData.get(`image-${index}`)?.toString() || '';
      const title = formData.get(`image-title-${index}`)?.toString() || '';
      if (file) {
        uploadedImages.push({ file, title });
      }
      index++;
    }

    options = uploadedImages;
  } else {
    store.dispatch(setButtonLoading(false));
    return {
      errors: {
        type: ['Invalid poll type.'],
      },
    };
  }

  // Validate form data
  const validatedFields = addPollFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    type,
    visibility: formData.get('visibility'),
    image: formData.get('image'),
    options,
    date:
      formData.get('closePollOnDate') === 'true'
        ? new Date(formData.get('date') as string)
        : undefined,
  });

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
    image,
    options: validOptions,
    type: validType,
    visibility,
    date,
  } = validatedFields.data;

  console.log('Validated data:', {
    title,
    description,
    options: validOptions,
    type: validType,
    visibility,
    image,
    date,
  });
  try {
    const result = await store
      .dispatch(
        apiSlice.endpoints.addPoll.initiate({
          title,
          description,
          options: validOptions,
          type: validType,
          visibility,
          image,
          date,
          creator: store.getState().auth.user.id,
        }),
      )
      .unwrap();
    console.log(result);
    window.location.reload();
    store.dispatch(setButtonLoading(false));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'data' in error) {
      const err = error as apiError;
      console.error('Помилка:', err);
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
      console.error('Невідома помилка:', error);
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
