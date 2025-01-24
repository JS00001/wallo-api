import User from '@/models/user';
import logger from '@/lib/logger';

/**
 * For every user that has not completed a lesson today, set their
 * streak back to 0
 */
const updateStreaks = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Resetting streaks for all users');

  await User.updateMany(
    { dailyLessonCount: { $eq: 0 } },
    { $set: { streak: 0 } },
  );

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished resetting streaks in ${time}ms`);
};

export default updateStreaks;
