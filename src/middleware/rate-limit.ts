import { Request } from 'express';
import { rateLimit as expressRateLimit } from 'express-rate-limit';

/**
 * Limits an endpoint to x (requests) per y (timeWindow) milliseconds.
 * Rate limits based on a per-chapter basis if possible, otherwise
 * rate limits based on the IP address.
 */
export default (requests: number, timeWindow: number) => {
  return expressRateLimit({
    windowMs: timeWindow,
    limit: requests,
    message: {
      error: {
        message: `RATE_LIMIT_EXCEEDED`,
        humanMessage: `Too many requests, please try again later.`,
      },
    },
    // keyGenerator(req: Request) {
    //   const userId = req.user?.id;

    //   // If we can rate limit based on the account, do so
    //   if (userId) {
    //     return userId;
    //   }

    //   // Otherwise, rate limit based on the IP address
    //   if (!req.ip) {
    //     return req.socket.remoteAddress;
    //   }

    //   return req.ip.replace(/:\d+[^:]*$/, '');
    // },
  });
};
