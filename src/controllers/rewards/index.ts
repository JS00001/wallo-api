import { Request, Response } from 'express';

import postClaim from './claim/post';

import handleRequest from '@/lib/request';

export default {
  postClaim: (req: Request, res: Response) =>
    handleRequest(req, res, postClaim, 'rewards', 'postClaim'),
};
