import express from 'express';

import coursesController from '@/controllers/courses';

// Route: /api/v1/courses
const coursesRouter = express.Router();

/** Get all of the courses for the user */
coursesRouter.get('/', coursesController.getCourses);

/** Get the current list of courses */
coursesRouter.get('/catalog', coursesController.getCatalog);

export default coursesRouter;
