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

const fd = (v: unknown) => (v instanceof FormData ? v : null);

const get = (fd: FormData, key: string) => fd.get(key)?.toString();

const optionSchema = z.object({
  file: z.union([
    z
      .string()
      .url({ message: 'URL зображення обов’язковий і має бути дійсним.' }),
    z.null(),
  ]),
  title: z
    .string()
    .min(1, { message: 'Назва варіанту обов’язкова.' })
    .max(100, { message: 'Назва варіанту має містити не більше 100 символів.' })
    .trim(),
});

const optionsFromFormData = z.preprocess((data) => {
  const formData = fd(data);
  if (!formData) return [];

  try {
    const parsed = JSON.parse(get(formData, 'options') ?? '[]') as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => {
      if (typeof item === 'string') {
        return { file: null, title: item };
      }

      if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>;
        const file = typeof record.file === 'string' ? record.file : null;
        const title = typeof record.title === 'string' ? record.title : '';
        return { file, title };
      }

      return { file: null, title: '' };
    });
  } catch {
    return [];
  }
}, z.unknown());

const basePollSchema = {
  title: z.string().min(1, { message: 'Назва обов’язкова.' }).max(100).trim(),

  description: z.string().max(500).optional(),

  image: z.string(),
  changeVote: z.boolean(),
  voteInterval: z.string(),

  resultsVisibility: z.nativeEnum(PollResultsVisibility),
  category: z.nativeEnum(Category),

  expireAt: z
    .date()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return date >= new Date(Date.now() + 2 * 60 * 1000);
      },
      {
        message:
          'Дата має бути щонайменше на 2 хвилини пізніше від поточного часу.',
      },
    ),
};

const pollSchema = z
  .object({
    ...basePollSchema,
    type: z.nativeEnum(PollType),
    options: optionsFromFormData.pipe(z.array(optionSchema)),
  })
  .superRefine((data, ctx) => {
    if (data.type === PollType.MULTIPLE) {
      if (data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Потрібно щонайменше два варіанти.',
        });
      }

      data.options.forEach((opt, index) => {
        if (opt.file !== null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['options', index, 'file'],
            message: 'Для MULTIPLE голосування поле file має бути null.',
          });
        }
      });
    }

    if (data.type === PollType.IMAGE) {
      if (data.options.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Потрібно щонайменше одне зображення.',
        });
      }

      data.options.forEach((opt, index) => {
        if (opt.file === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['options', index, 'file'],
            message: 'Зображення обов’язкове.',
          });
        }
      });
    }
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
        ? new Date(get(data, 'expireAtDate')!)
        : undefined,
    // Pass the whole FormData further so `optionsFromFormData` can extract options
    // based on poll type and related fields.
    options: data,
  };
}, pollSchema);
