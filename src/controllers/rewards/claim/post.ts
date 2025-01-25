import { z } from 'zod';
import { Request } from 'express';

import { IResponse } from '@/lib/request';
import { getRandomReward } from '@/lib/util';
import { ISanitizedUser, Reward } from '@/models/@types';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{
  virtualCurrency: number;
  user: ISanitizedUser;
}>;

/**
 * Endpoint:     POST /api/v1/rewards/claim
 * Description:  Claim any daily reward, if available
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    type: z.enum(Object.keys(Reward) as [string, ...string[]], {
      invalid_type_error: 'Invalid reward type',
    }),
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const type = params.data.type as Reward;

  if (user.claimedDailyRewards.includes(type)) {
    throw new APIError({
      type: 'BAD_REQUEST',
      traceback: 2,
      humanMessage: 'You have already claimed this reward for today',
    });
  }

  if (type === Reward.OneLesson && user.dailyLessonCount < 1) {
    throw new APIError({
      type: 'BAD_REQUEST',
      traceback: 3,
      humanMessage: 'You have not completed a lesson today',
    });
  }

  if (type === Reward.ThreeLessons) {
    if (user.dailyLessonCount < 3) {
      throw new APIError({
        type: 'BAD_REQUEST',
        traceback: 4,
        humanMessage: 'You have not completed three lessons today',
      });
    }
  }

  const rewardValue = getRandomReward();

  await errorWrapper(2, () => {
    user.virtualCurrency += rewardValue;
    user.claimedDailyRewards.push(type);
    return user.save();
  });

  const sanitizedUser = user.sanitize();

  const response: Response = {
    data: {
      user: sanitizedUser,
      virtualCurrency: rewardValue,
    },
  };

  return response;
};
