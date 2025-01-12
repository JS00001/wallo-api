import express from 'express';

import authController from '@/controllers/auth';
import rateLimit from '@/middleware/rate-limit';
import { rateLimits } from '@/constants/rate-limits';

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

export default authRouter;
