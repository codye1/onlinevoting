import { z } from 'zod';

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

export type addPollFormState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        options?: string[];
        visibility?: string[];
        type?: string[];
        date?: string[];
        changeVote?: string[];
        interval?: string[];
      };
      message?: string;
    }
  | undefined;

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

export const addPollFormSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Назва обов’язкова.' })
      .max(100, { message: 'Назва має містити не більше 100 символів.' })
      .trim(),
    image: z.string(),
    changeVote: z.boolean(),
    interval: z.string(),
    description: z
      .string()
      .max(500, { message: 'Опис має містити не більше 500 символів.' })
      .optional(),
    type: z.enum(['multiple', 'img'], { message: 'Недійсний тип опитування.' }),
    visibility: z.string().min(1, { message: 'Видимість обов’язкова.' }),
    category: z.string(),
    date: z
      .date()
      .optional()
      .refine(
        (date) => {
          if (!date) return true;
          const now = new Date();
          const minFutureTime = new Date(now.getTime() + 2 * 60 * 1000);
          return date >= minFutureTime;
        },
        {
          message:
            'Дата має бути щонайменше на 2 хвилини пізніше від поточного часу.',
        },
      ),
    options: z.union([
      z
        .array(
          z
            .string()
            .min(1, { message: 'Варіант не може бути порожнім.' })
            .max(100, {
              message: 'Варіант має містити не більше 100 символів.',
            })
            .trim(),
        )
        .min(2, { message: 'Потрібно щонайменше два непорожні варіанти.' }),

      z
        .array(imageSchema)
        .min(1, { message: 'Потрібно щонайменше одне зображення з назвою.' }),
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'multiple') {
      if (
        !Array.isArray(data.options) ||
        !data.options.every((opt) => typeof opt === 'string')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message:
            'Варіанти мають бути масивом рядків для опитування з множинним вибором.',
        });
      }
    } else if (data.type === 'img') {
      if (
        !Array.isArray(data.options) ||
        !data.options.every(
          (opt) =>
            typeof opt === 'object' &&
            opt !== null &&
            'file' in opt &&
            'title' in opt &&
            typeof opt.file === 'string' &&
            typeof opt.title === 'string',
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message:
            'Варіанти мають бути масивом об’єктів із зображеннями, що містять URL і назву для опитування із зображеннями.',
        });
      }
    }
  });
