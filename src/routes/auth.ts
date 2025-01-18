import express from 'express';

import authMiddleware from '@/middleware/auth';
import authController from '@/controllers/auth';
import rateLimit from '@/middleware/rate-limit';
import { rateLimits } from '@/constants/rate-limits';
import { TokenType } from '@/middleware/auth/authenticate-token';

// Route: /api/v1/auth
const authRouter = express.Router();

/** Login or register using apple oauth */
authRouter.post(
  '/apple',
  rateLimit(rateLimits.login.requests, rateLimits.login.timeWindowMs),
  authController.postApple,
);

/** Login or register using google oauth */
authRouter.post(
  '/google',
  rateLimit(rateLimits.login.requests, rateLimits.login.timeWindowMs),
  authController.postGoogle,
);

/** Refresh an access token using a refresh token */
authRouter.post(
  '/refresh',
  authMiddleware.authenticateToken(TokenType.Refresh),
  rateLimit(rateLimits.default.requests, rateLimits.default.timeWindowMs),
  authController.postRefresh,
);

/** Logout via refresh token */
authRouter.post(
  '/logout',
  authMiddleware.authenticateToken(TokenType.Refresh),
  rateLimit(rateLimits.default.requests, rateLimits.default.timeWindowMs),
  authController.postLogout,
);

export default authRouter;
