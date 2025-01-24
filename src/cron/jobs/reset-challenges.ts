import User from '@/models/user';
import logger from '@/lib/logger';

/**
 * Reset the lessons that the user has completed today, along with
 * the daily reward
 */
const resetChallenges = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Resetting challenges for all users');

  await User.updateMany(
    {},
    { $set: { dailyLessonCount: 0, claimedDailyReward: false } },
  );

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished resetting challenges in ${time}ms`);
};

export default resetChallenges;
