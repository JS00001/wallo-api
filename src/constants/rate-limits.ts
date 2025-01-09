import config from '@/constants';

/**
 * Rate limits allow limiting the number of requests a user can make in a
 * given time window. This is useful for preventing abuse of our APIs and
 * protecting against brute force attacks.
 */
export const rateLimits = {
  /**
   * Default rate limit for all requests. This is the rate limit for
   * requests that do not have a specific rate limit defined.
   */
  default: {
    requests: {
      test: 35,
      dev: 150,
      prod: 150,
    }[config.NodeEnv],
    timeWindowMs: 60000,
  },
  /**
   * Rate limit for login requests
   * /api/v1/consumer/auth/login
   */
  login: {
    requests: {
      test: 20,
      dev: 8,
      prod: 5,
    }[config.NodeEnv],
    timeWindowMs: 60000,
  },
};
