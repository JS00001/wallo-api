import express from 'express';

import lessonsController from '@/controllers/lessons';

// Route: /api/v1/lessons
const lessonsRouter = express.Router();

/** Get a specific lesson */
lessonsRouter.get('/:id', lessonsController.getLesson);

export default lessonsRouter;
