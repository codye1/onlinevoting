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

// Schema for validating image objects
const imageSchema = z.object({
  file: z.string().url({ message: 'Image URL is required and must be valid.' }),
  title: z
    .string()
    .min(1, { message: 'Image title is required.' })
    .max(100, { message: 'Image title must be 100 characters or less.' })
    .trim(),
});

export const addPollFormSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Title is required.' })
      .max(100, { message: 'Title must be 100 characters or less.' })
      .trim(),
    image: z.string(),
    description: z
      .string()
      .max(500, { message: 'Description must be 500 characters or less.' })
      .optional(),
    type: z.enum(['multiple', 'img'], { message: 'Invalid poll type.' }),
    visibility: z.string().min(1, { message: 'Visibility is required.' }),
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
    options: z.union([
      // For type: 'multiple'
      z
        .array(
          z
            .string()
            .min(1, { message: 'Option cannot be empty.' })
            .max(100, { message: 'Option must be 100 characters or less.' })
            .trim(),
        )
        .min(2, { message: 'At least two non-empty options are required.' }),
      // For type: 'img'
      z
        .array(imageSchema)
        .min(1, { message: 'At least one image with a title is required.' }),
    ]),
  })
  .superRefine((data, ctx) => {
    // Validate options based on poll type
    if (data.type === 'multiple') {
      // Ensure options is an array of strings
      if (
        !Array.isArray(data.options) ||
        !data.options.every((opt) => typeof opt === 'string')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message:
            'Options must be an array of strings for multiple choice poll.',
        });
      }
    } else if (data.type === 'img') {
      // Ensure options is an array of objects with file (string) and title
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
            'Options must be an array of image objects with URL and title for image poll.',
        });
      }
    }
  });
