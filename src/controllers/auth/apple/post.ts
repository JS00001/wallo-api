import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';

import { APIError, errorWrapper } from '@/lib/error';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import apple from '@/lib/apple';

interface AppleTokenSchema {
  /** The issuer of the token */
  iss: string;
  /** The audience of the token (app bundle id) */
  aud: string;
  /** When the token expires */
  exp: number;
  /** When the token was issued */
  iat: number;
  /** The subject of the token (unique user id) */
  sub: string;
  /** The email of the user */
  email: string;
  /** Whether the email is verified */
  email_verified: boolean | 'true' | 'false';
  /** Whether the email is a proxy email */
  is_private_email: boolean | 'true' | 'false';
}

type Response = IResponse<{}>;

/**
 * Endpoint:     POST /api/v1/auth/apple
 * Description:  Login or register using Apple OAuth
 */
export default async (req: Request): Promise<Response> => {
  const schema = z.object({
    user: z.string(),
    identityToken: z.string(),
    email: validators.email.nullable(),
    fullName: z
      .object({
        givenName: validators.firstName,
        familyName: validators.lastName,
      })
      .nullable(),
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { identityToken, user, email, fullName } = params.data;

  const header = jwt.decode(identityToken, { complete: true })?.header;

  if (!header) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 2,
      humanMessage: 'Invalid identity token',
    });
  }

  const tokenKid = header.kid;

  if (!tokenKid) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 3,
      humanMessage: 'Invalid identity token',
    });
  }

  const applePublicKey = await errorWrapper(4, async () => {
    return apple.getPublicKey(tokenKid);
  });

  const kid = applePublicKey.kid;

  const client = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    timeout: 30000,
  });

  const publicKey = await errorWrapper(5, async () => {
    return (await client.getSigningKey(kid)).getPublicKey();
  });

  const decoded = await errorWrapper(6, async () => {
    return jwt.verify(identityToken, publicKey) as AppleTokenSchema;
  });

  if (decoded.iss !== 'https://appleid.apple.com') {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 7,
      humanMessage: 'Invalid token issuer',
    });
  }

  console.log(decoded);
  console.log(email, fullName, user);

  // TODO: Add this as the app bundle id
  // if (decoded.aud !== 'app bundle id') { }

  const response: Response = {
    data: {},
  };

  return response;
};
