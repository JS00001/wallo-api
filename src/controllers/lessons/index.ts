import { Request, Response } from 'express';

import getLesson from './[id]/get';

import handleRequest from '@/lib/request';

export default {
  getLesson: (req: Request, res: Response) =>
    handleRequest(req, res, getLesson, 'lessons', 'getLesson'),
};
