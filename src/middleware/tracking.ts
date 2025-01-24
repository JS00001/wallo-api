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
    const clientTimezone = req.headers['x-timezone'] as string | undefined;
    const clientVersion = req.headers['x-client-version'] as string | undefined;

    const currentTimeMillis = new Date().getTime();
    const lastOnlineTimeMillis = user.lastOnlineAt.getTime();

    // #region Update last online time, if needed
    const shouldUpdateLastOnline =
      lastOnlineTimeMillis + REFRESH_RATE_MS < currentTimeMillis;

    if (shouldUpdateLastOnline) {
      user.lastOnlineAt = new Date();
    }

    // #endregion
    // #region Update timezone, if needed
    const shouldUpdateClientVersion =
      clientVersion && user.clientVersion !== clientVersion;

    if (shouldUpdateClientVersion) {
      user.clientVersion = clientVersion;
    }

    // #endregion
    // #region Update timezone, if needed
    const shouldUpdateTimezone = clientTimezone && !user.timezone;

    if (shouldUpdateTimezone) {
      user.timezone = clientTimezone;
    }

    // #endregion
    // #region Save user, if needed
    const shouldSaveUser =
      shouldUpdateClientVersion ||
      shouldUpdateLastOnline ||
      shouldUpdateTimezone;

    if (shouldSaveUser) {
      await user.save();
    }

    // #endregion
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
