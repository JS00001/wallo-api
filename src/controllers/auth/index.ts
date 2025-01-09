import { Request, Response } from 'express';

import postApple from './apple/post';
import postGoogle from './google/post';

import handleRequest from '@/lib/request';

export default {
  postApple: (req: Request, res: Response) =>
    handleRequest(req, res, postApple, 'auth', 'postApple'),
  postGoogle: (req: Request, res: Response) =>
    handleRequest(req, res, postGoogle, 'auth', 'postGoogle'),
};
