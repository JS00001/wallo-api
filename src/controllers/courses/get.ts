import { Request } from 'express';

import Course from '@/models/course';
import { IResponse } from '@/lib/request';

type Response = IResponse<{}>;

/**
 * Endpoint:     GET /api/v1/courses
 * Description:  Get all of the courses for the user
 */
export default async (req: Request): Promise<Response> => {
  const courses = await Course.find({});

  const response: Response = {
    data: {},
  };

  return response;
};
