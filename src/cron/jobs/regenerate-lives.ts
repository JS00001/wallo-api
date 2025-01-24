import User from '@/models/user';
import metadata from '@/constants/metadata';
import logger from '@/lib/logger';

/**
 * For all users with less than full lives, increment
 * their lives by 1
 */
const regenerateLives = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Regenerating lives for all users');

  const response = await User.updateMany(
    { lives: { $lt: metadata.defaultLives } },
    { $inc: { lives: 1 } },
  );

  const count = response.modifiedCount;

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished regenerating ${count} lives in ${time}ms`);
};

export default regenerateLives;
