import { z } from 'zod';
import { EMAIL_REGEX, NAME_REGEX } from '../utils/validationRegex';

/**
 * Step 1 Schema: Personal Information
 */
export const stepOneSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .regex(NAME_REGEX, 'First name should only contain letters, hyphens, or spaces'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .regex(NAME_REGEX, 'Last name should only contain letters, hyphens, or spaces'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const birthDate = new Date(val);
      if (isNaN(birthDate.getTime())) return false;
      const now = new Date();
      if (birthDate > now) return false;

      // Age calculation
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }, {
      message: 'You must be at least 18 years old to open an account',
    }),
});

/**
 * Step 2 Schema: Account Details
 */
const stepTwoFields = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .refine((val) => val.includes('@'), {
      message: 'Email must contain an "@" symbol',
    })
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Please enter a valid email format (e.g., alex@company.com)',
    }),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
});

export const stepTwoSchema = stepTwoFields.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must strictly match',
  path: ['confirmPassword'],
});

/**
 * Full Registration Unified Schema for Step 3 Submission
 */
export const registrationSchema = z
  .object({
    firstName: stepOneSchema.shape.firstName,
    lastName: stepOneSchema.shape.lastName,
    dateOfBirth: stepOneSchema.shape.dateOfBirth,
    ...stepTwoFields.shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must strictly match',
    path: ['confirmPassword'],
  });
