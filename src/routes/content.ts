import express from 'express';

import contentController from '@/controllers/content';

// Route: /api/v1/content
const contentRouter = express.Router();

/** Get a courses markdown content */
contentRouter.get('/:id', contentController.getContent);

export default contentRouter;
