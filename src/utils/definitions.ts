import { z } from 'zod';
import { Category, PollResultsVisibility, PollType } from './types.ts';

export type loginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        auth?: string[];
      };
      message?: string;
    }
  | undefined;

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Будь ласка, введіть дійсну електронну адресу.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Має містити щонайменше 8 символів.' })
    .regex(/[a-zA-Z]/, { message: 'Має містити щонайменше одну літеру.' })
    .regex(/[0-9]/, { message: 'Має містити щонайменше одну цифру.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Має містити щонайменше один спеціальний символ.',
    })
    .trim(),
});

export type signupFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export const signupFormState = z
  .object({
    email: z
      .string()
      .email({ message: 'Будь ласка, введіть дійсну електронну адресу.' })
      .trim(),
    password: z
      .string()
      .min(8, { message: 'Має містити щонайменше 8 символів.' })
      .regex(/[a-zA-Z]/, { message: 'Має містити щонайменше одну літеру.' })
      .regex(/[0-9]/, { message: 'Має містити щонайменше одну цифру.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Має містити щонайменше один спеціальний символ.',
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не збігаються.',
    path: ['confirmPassword'],
  });

const fd = (v: unknown) => v instanceof FormData ? v : null;

const get = (fd: FormData, key: string) =>
  fd.get(key)?.toString();

const imageSchema = z.object({
  file: z
    .string()
    .url({ message: 'URL зображення обов’язковий і має бути дійсним.' }),
  title: z
    .string()
    .min(1, { message: 'Назва зображення обов’язкова.' })
    .max(100, {
      message: 'Назва зображення має містити не більше 100 символів.',
    })
    .trim(),
});


const optionsFromFormData = z.preprocess((data) => {
  const formData = fd(data);
  if (!formData) return [];

  const type = get(formData, 'type');

  if (type === PollType.MULTIPLE) {
    try {
      return JSON.parse(get(formData, 'options') ?? '[]');
    } catch {
      return [];
    }
  }

  if (type === PollType.IMAGE) {
    const result: { file: string; title: string }[] = [];
    let i = 0;

    while (formData.has(`image-${i}`)) {
      const file = get(formData, `image-${i}`);
      const title = get(formData, `image-title-${i}`) ?? '';

      if (file) result.push({ file, title });
      i++;
    }

    return result;
  }

  return [];
}, z.unknown());

const basePollSchema = {
  title: z
    .string()
    .min(1, { message: 'Назва обов’язкова.' })
    .max(100)
    .trim(),

  description: z.string().max(500).optional(),

  image: z.string(),
  changeVote: z.boolean(),
  voteInterval: z.string(),

  resultsVisibility: z.nativeEnum(PollResultsVisibility),
  category: z.nativeEnum(Category),

  expireAt: z
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return date >= new Date(Date.now() + 2 * 60 * 1000);
    }, {
      message:
        'Дата має бути щонайменше на 2 хвилини пізніше від поточного часу.',
    }),
};

const multiplePollSchema = z.object({
  ...basePollSchema,
  type: z.literal(PollType.MULTIPLE),
  options: optionsFromFormData.pipe(
    z.array(
      z.string().min(1).max(100).trim(),
    ).min(2, {
      message: 'Потрібно щонайменше два варіанти.',
    }),
  ),
});

const imagePollSchema = z.object({
  ...basePollSchema,
  type: z.literal(PollType.IMAGE),
  options: optionsFromFormData.pipe(
    z.array(imageSchema).min(1, {
      message: 'Потрібно щонайменше одне зображення.',
    }),
  ),
});

export const addPollFormSchema = z.preprocess((data) => {
  if (!(data instanceof FormData)) return data;

  return {
    title: get(data, 'title'),
    description: get(data, 'description') || undefined,
    image: get(data, 'image') || '',
    changeVote: get(data, 'changeVote') === 'on',
    voteInterval: get(data, 'voteInterval') ?? '',
    resultsVisibility: get(data, 'resultsVisibility'),
    category: get(data, 'category'),
    type: get(data, 'type'),
    expireAt:
      get(data, 'closePollOnDate') === 'true'
        ? new Date(get(data, 'date')!)
        : undefined,
    options: undefined,
  };
},
z.discriminatedUnion('type', [
  multiplePollSchema,
  imagePollSchema,
]));

