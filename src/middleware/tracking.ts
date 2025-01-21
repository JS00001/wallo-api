import { Request, Response, NextFunction } from 'express';

import { ErrorHandler } from '@/lib/error';

const REFRESH_RATE_MS = 60000; // How often to update the last online time

/**
 * For every request, if the user has not made a request in the last 1 minute,
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

    const currentTimeMillis = new Date().getTime();
    const lastOnlineTimeMillis = user.lastOnlineAt.getTime();

    // Update the 'last online' time if needed
    const shouldUpdateLastOnline =
      lastOnlineTimeMillis + REFRESH_RATE_MS < currentTimeMillis;

    if (shouldUpdateLastOnline) {
      user.lastOnlineAt = new Date();
    }

    // Update the client version if needed
    const shouldUpdateClientVersion =
      clientVersion && user.clientVersion !== clientVersion;

    if (shouldUpdateClientVersion) {
      user.clientVersion = clientVersion;
    }

    // Save the user if needed
    const shouldSaveUser = shouldUpdateClientVersion || shouldUpdateLastOnline;

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
