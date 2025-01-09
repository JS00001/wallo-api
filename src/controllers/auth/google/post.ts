import { Request } from 'express';
import { IResponse } from '@/lib/request';

type Response = IResponse<{}>;

/**
 * Endpoint:     POST /api/v1/auth/google
 * Description:  Login or register using Google OAuth
 */
export default async (req: Request): Promise<Response> => {
  const response: Response = {
    data: {},
  };

  return response;
};
