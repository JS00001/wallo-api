import { Request, Response } from 'express';

import getCourses from './get';
import getCourse from './[id]/get';
import getCatalog from './catalog/get';

import handleRequest from '@/lib/request';

export default {
  getCourses: (req: Request, res: Response) =>
    handleRequest(req, res, getCourses, 'courses', 'getCourses'),
  getCatalog: (req: Request, res: Response) =>
    handleRequest(req, res, getCatalog, 'courses', 'getCatalog'),
  getCourse: (req: Request, res: Response) =>
    handleRequest(req, res, getCourse, 'courses', 'getCourse'),
};
