import { Request } from 'express';

import Course from '@/models/course';
import { IResponse } from '@/lib/request';
import { ICourse } from '@/models/@types';

type Response = IResponse<{
  courses: ICourse[];
}>;

/**
 * Endpoint:     GET /api/v1/courses
 * Description:  Get all of the courses available
 */
export default async (req: Request): Promise<Response> => {
  const courses = await Course.find({});

  const response: Response = {
    data: {
      courses,
    },
  };

  return response;
};
