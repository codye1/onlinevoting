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

export const normalizeDateValue = (value: unknown): Date | undefined => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  if (Array.isArray(value)) {
    const maybeDates = value.filter(
      (v): v is Date => v instanceof Date && !Number.isNaN(v.getTime()),
    );
    // DateTimePicker range mode returns [start, end]; prefer end if present.
    return maybeDates.length > 0
      ? maybeDates[maybeDates.length - 1]
      : undefined;
  }

  return undefined;
};

export const addPollValuesSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Назва обов’язкова.' })
      .max(100, { message: 'Назва має містити не більше 100 символів.' })
      .trim(),

    description: z
      .string()
      .max(500, {
        message: 'Опис має містити не більше 500 символів.',
      })
      .trim(),

    image: z.union([
      z.literal(''),
      z
        .string()
        .url({ message: 'URL зображення має бути дійсним.' })
        .max(2048, {
          message: 'URL зображення має містити не більше 2048 символів.',
        }),
    ]),
    type: z.nativeEnum(PollType),
    options: z.array(optionSchema),

    resultsVisibility: z.nativeEnum(PollResultsVisibility),
    category: z.nativeEnum(Category),

    changeVote: z.boolean(),
    voteInterval: z.string(),

    expireAt: z.unknown(),
  })
  .superRefine((data, ctx) => {
    if (data.expireAt) {
      console.log(data);

      const date = normalizeDateValue(data.expireAt);

      if (!date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expireAt'],
          message: 'Вкажіть коректну дату завершення.',
        });
      } else if (date < new Date(Date.now() + 2 * 60 * 1000)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expireAt'],
          message:
            'Дата має бути щонайменше на 2 хвилини пізніше від поточного часу.',
        });
      }
    }

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
