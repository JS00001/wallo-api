import express from 'express';

import rewardsController from '@/controllers/rewards';

// Route: /api/v1/rewards
const rewardsRouter = express.Router();

/** Claim any daily reward */
rewardsRouter.post('/claim', rewardsController.postClaim);

export default rewardsRouter;
