import { Request, Response } from 'express';

import getCatalog from './catalog/get';

import handleRequest from '@/lib/request';

export default {
  getCatalog: (req: Request, res: Response) =>
    handleRequest(req, res, getCatalog, 'courses', 'getCatalog'),
};
