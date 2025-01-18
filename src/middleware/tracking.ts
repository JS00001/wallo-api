import { Request, Response, NextFunction } from 'express';

import { ErrorHandler } from '@/lib/error';

/**
 * For every request, if the chapter has not made a request in the last 1 minute,
 * update it to the current time.
 */
const updateLastOnline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const clientVersion = req.headers['x-client-version'] as string | undefined;

    const REFRESH_RATE_MS = 60000; // How often to update the last online time

    const currentTimeMillis = new Date().getTime();
    const lastOnlineTimeMillis = user.lastOnlineAt.getTime();

    const shouldUpdateClientVersion =
      clientVersion && user.clientVersion !== clientVersion;

    const shouldUpdateLastOnline =
      lastOnlineTimeMillis + REFRESH_RATE_MS < currentTimeMillis;

    const shouldSaveUser = shouldUpdateClientVersion || shouldUpdateLastOnline;

    // Update the last online time if it has been more than 1 minute
    user.lastOnlineAt = shouldUpdateLastOnline ? new Date() : user.lastOnlineAt;

    // Update the client version if it has changed
    user.clientVersion = shouldUpdateClientVersion
      ? clientVersion
      : user.clientVersion;

    if (shouldSaveUser) {
      await user.save();
    }

    next();
  } catch (err) {
    const errorHandler = new ErrorHandler({
      res,
      fileName: __filename,
      methodName: 'updateLastOnline',
    });

    errorHandler.handle(err);
  }
};

export default { updateLastOnline };
