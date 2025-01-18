import { Request, Response, NextFunction } from 'express';

import jwt from '@/lib/jwt';
import User from '@/models/user';
import { SystemRole } from '@/models/@types';
import { APIError, ErrorHandler, errorWrapper } from '@/lib/error';

export enum TokenType {
  Access,
  Refresh,
  Admin,
}

/**
 * Verifies the header to have an authorization token
 * with the type requested. If valid, sets the user
 * on the request object
 */
export default async (
  req: Request,
  res: Response,
  next: NextFunction,
  tokenType: TokenType = TokenType.Access,
) => {
  try {
    const headers = req.headers;

    if (!headers.authorization) {
      throw new APIError({
        type: 'UNAUTHORIZED',
        traceback: 0,
      });
    }

    const authToken = headers.authorization.split(' ')[1];
    const payload =
      tokenType === TokenType.Refresh
        ? jwt.verifyRefreshToken(authToken)
        : jwt.verifyAccessToken(authToken);

    if (!payload) {
      throw new APIError({
        type: 'UNAUTHORIZED',
        traceback: 1,
      });
    }

    if (payload === 'expired') {
      throw new APIError({
        type: 'EXPIRED_TOKEN',
        traceback: 2,
      });
    }

    const user = await User.findById(payload['userId']);

    if (!user) {
      throw new APIError({
        type: 'UNAUTHORIZED',
        traceback: 3,
      });
    }

    /** Verify admin tokens */
    if (tokenType === TokenType.Admin) {
      const role = user.systemRole;

      if (role !== SystemRole.Admin) {
        throw new APIError({
          type: 'UNAUTHORIZED',
          traceback: 5,
        });
      }
    }

    /** Verify refresh tokens */
    if (tokenType === TokenType.Refresh) {
      const isRefreshTokenValid = await errorWrapper(5, () => {
        const token = payload['refreshTokenId'];
        return user.validateRefreshToken(token);
      });

      if (!isRefreshTokenValid) {
        throw new APIError({
          type: 'UNAUTHORIZED',
          traceback: 6,
        });
      }
    }

    req.user = user;

    next();
  } catch (err) {
    const errorHandler = new ErrorHandler({
      res,
      fileName: 'auth',
      methodName: 'authenticateToken',
    });

    errorHandler.handle(err);
  }
};
