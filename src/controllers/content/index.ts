import { Request, Response } from 'express';

import getContent from './[id]/get';

import handleRequest from '@/lib/request';

export default {
  getContent: (req: Request, res: Response) =>
    handleRequest(req, res, getContent, 'content', 'getContent'),
};
