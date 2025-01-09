import { z } from 'zod';

// prettier-ignore
const validators = {
  /**
   * MongoDB ObjectID or UUID (as the primary key for a document)
   */
  objectId: z
    .string({
      required_error: 'ID is required',
      invalid_type_error: 'ID must be a string',
    })
    .regex(/^[a-fA-F0-9]{24}$/, {
      message: 'ID must be a valid ObjectID or UUID, or string',
    })
    .or(
      z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
      })
      .uuid({
        message: 'ID must be a valid ObjectID, UUID, or string',
      }),
    ),

  /**
   * Validates user emails, and lowercases them
   * so that they are case-insensitive
   */
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Email must be a valid email address',
    })
    .toLowerCase(),
    
  /**
   * Validates user first names
   */
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, {
      message: 'Name must be at least 1 character',
    })
    .max(32, {
      message: 'Name must be at most 32 characters',
    }),

  /**
   * Validates user last names
   */
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, {
      message: 'Name must be at least 1 character',
    })
    .max(48, {
      message: 'Name must be at most 48 characters',
    }),

  /**
   * Validates user content that is a short string
   */
  shortContentString: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(1, {
      message: 'Must be at least 1 character',
    })
    .max(128, {
      message: 'Must be at most 128 characters',
    }),

  /**
   * Validates user content that is a long string
   */
  longContentString: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(1, {
      message: 'Must be at least 1 character',
    })
    .max(1024, {
      message: 'Must be at most 1024 characters',
    }),

  /**
   * Pagination offset
   */
  paginationOffset: z.coerce
    .number({
      required_error: 'Offset is required',
      invalid_type_error: 'Offset must be a number',
    })
    .gte(0, {
      message: 'Offset must be a positive number',
    }),

  /**
   * Date and time
   */
  dateTime: z
    .string({
      required_error: 'Datetime is required',
      invalid_type_error: 'Datetime must be a string',
    })
    .datetime({ offset: true, message: 'Datetime must be a valid date' }),

  /**
   * Validates that a URL is a valid URL
   */
  url: z
    .string({
      required_error: 'URL is required',
      invalid_type_error: 'URL must be a string',
    })
    .url({
      message: 'URL must be a valid URL',
    }),
};

export default validators;
