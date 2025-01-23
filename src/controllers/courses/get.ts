import { Request } from 'express';

import { IResponse } from '@/lib/request';
import { IPopulatedCourse } from '@/models/@types';
import CourseAggregation from '@/database/aggregations/course';

type Response = IResponse<{
  courses: IPopulatedCourse[];
}>;

/**
 * Endpoint:     GET /api/v1/courses
 * Description:  Get all of the courses for the user
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const courses = await CourseAggregation.queryCourses({}, user);

  const response: Response = {
    data: {
      courses,
    },
  };

  return response;
};
