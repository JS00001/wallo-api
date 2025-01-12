/*
 * Created on Sun Aug 20 2023
 *
 * This software is the proprietary property of CampusRush.
 * All rights reserved. Unauthorized copying, modification, or distribution
 * of this software, in whole or in part, is strictly prohibited.
 * For licensing information contact CampusRush.
 *
 * Copyright (c) 2023 CampusRush
 * Do not distribute
 */

import cors from 'cors';
import helmet from 'helmet';
import express, { Request } from 'express';

import authRouter from '@/routes/auth';
import contentRouter from '@/routes/content';

import trustedProxies from '@/constants/proxies';
import loggingMiddleware from '@/middleware/logging';
import { APIError, ErrorHandler } from '@/lib/error';

const app: express.Application = express();

// Middleware
app.use(loggingMiddleware.logRequest);
app.set('trust proxy', trustedProxies);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Heartbeat Route
app.get('/', (_, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);

// Catch all 404 errors
app.use((req: Request, res: express.Response) => {
  const errorHandler = new ErrorHandler({
    res,
    fileName: __filename,
    methodName: 'use',
  });

  const error = new APIError({
    type: 'NOT_FOUND',
    traceback: 1,
    humanMessage: `Route ${req.url} not found`,
  });

  errorHandler.handle(error);
});

// Fallback error handler, prevents server crashes
app.use((_: Request, res: express.Response) => {
  const errorHandler = new ErrorHandler({
    res,
    fileName: __filename,
    methodName: 'use',
  });

  const error = new APIError({
    type: 'INTERNAL_SERVER_ERROR',
    traceback: 2,
  });

  errorHandler.handle(error);
});

export default app;
