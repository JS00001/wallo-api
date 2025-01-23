import { z } from 'zod';
import { Request } from 'express';

import Course from '@/models/course';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import { ISanitizedUser } from '@/models/@types';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{
  user: ISanitizedUser;
}>;

/**
 * Endpoint:     PUT /api/v1/user
 * Description:  Update the currently logged in user
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    age: z.number().int().min(0).optional(),
    preferredCourses: z.array(validators.objectId).optional(),
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { age, preferredCourses } = params.data;

  // #region Update User's age
  if (age !== undefined) {
    user.age = age;
  }

  // #endregion
  // #region Update User's preferred courses
  if (preferredCourses !== undefined) {
    const matchingCourses = await Course.find({
      _id: { $in: preferredCourses },
    });

    if (matchingCourses.length !== preferredCourses.length) {
      throw new APIError({
        type: 'INVALID_FIELDS',
        traceback: 2,
        error: 'One or more courses do not exist',
      });
    }

    const courseIds = matchingCourses.map((course) => course._id);

    user.preferredCourses = courseIds;
  }

  // #endregion
  // #region Save User and return sanitized user
  await errorWrapper(3, () => {
    user.onboarded = true;
    return user.save();
  });

  const sanitizedUser = user.sanitize();

  const response: Response = {
    data: {
      user: sanitizedUser,
    },
  };

  return response;
};
