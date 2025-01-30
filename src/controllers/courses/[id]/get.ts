import { Request } from 'express';

import { IResponse } from '@/lib/request';

import { z } from 'zod';
import Course from '@/models/course';
import validators from '@/lib/validators';
import { APIError, errorWrapper } from '@/lib/error';
import { ICourse, IPopulatedLesson } from '@/models/@types';
import LessonsAggregation from '@/database/aggregations/lessons';

type Response = IResponse<{
  course: ICourse;
  lessons: IPopulatedLesson[];
}>;

/**
 * Endpoint:     GET /api/v1/courses/:id
 * Description:  Get a specific course and its lessons
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;
  const schema = z.object({
    id: validators.objectId,
  });

  const params = schema.safeParse(req.params);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { id } = params.data;

  const course = await errorWrapper(2, () => {
    return Course.findById(id);
  });

  if (!course) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 3,
      humanMessage: 'Course not found',
    });
  }

  const lessons = await LessonsAggregation.queryLessons(
    { course: course._id },
    user,
  );

  const response: Response = {
    data: {
      course,
      lessons,
    },
  };

  return response;
};
