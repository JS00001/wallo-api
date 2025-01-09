import { Request } from 'express';
import { IResponse } from '@/lib/request';
import { z } from 'zod';
import validators from '@/lib/validators';

type Response = IResponse<{}>;

/**
 * Endpoint:     POST /api/v1/auth/apple
 * Description:  Login or register using Apple OAuth
 */
export default async (req: Request): Promise<Response> => {
  const schema = z.object({
    user: z.string(),
    email: validators.email,
    fullName: z.object({
      givenName: validators.firstName,
      familyName: validators.lastName,
    }),
    identityToken: z.string(),
  });

  const response: Response = {
    data: {},
  };

  return response;
};
