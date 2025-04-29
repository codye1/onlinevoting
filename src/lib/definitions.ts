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
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
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
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
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
      };
      message?: string;
    }
  | undefined;

export const addPollFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(100, { message: 'Title must be 100 characters or less.' })
    .trim(),
  description: z
    .string()
    .max(500, { message: 'Description must be 500 characters or less.' })
    .optional(),
  options: z
    .array(z.string().min(1, { message: 'Option cannot be empty.' }))
    .min(1, { message: 'At least two non-empty options are required.' }),
  type: z.string().min(1, { message: 'Option cannot be empty.' }),
  visibility: z.string().min(1, { message: 'Option cannot be empty.' }),
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
      { message: 'Date must be at least 2 minutes in the future.' },
    ),
});
