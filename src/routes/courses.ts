import express from 'express';

import coursesController from '@/controllers/courses';

// Route: /api/v1/courses
const coursesRouter = express.Router();

/** Get the currently signed in courses */
coursesRouter.get('/catalog', coursesController.getCatalog);

export default coursesRouter;
