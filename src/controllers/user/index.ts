import { Request, Response } from 'express';

import getUser from './get';
import putUser from './put';

import handleRequest from '@/lib/request';

export default {
  getUser: (req: Request, res: Response) =>
    handleRequest(req, res, getUser, 'user', 'getUser'),
  putUser: (req: Request, res: Response) =>
    handleRequest(req, res, putUser, 'user', 'putUser'),
};
