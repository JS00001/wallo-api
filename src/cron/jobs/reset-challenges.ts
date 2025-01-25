import User from '@/models/user';
import logger from '@/lib/logger';
import { DateTime } from 'luxon';

/**
 * Reset the lessons that the user has completed today, along with
 * the daily reward
 */
const resetChallenges = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Resetting challenges for all users');

  const utcTime = DateTime.utc();
  const users = await User.find({});

  // Get only the users whose current time is midnight
  const usersToUpdate = users
    .filter((user) => {
      const userTime = utcTime.setZone(user.timezone);
      return userTime.hour === 0;
    })
    .map((user) => user._id);

  // Update the daily challenges for only the users whose current time is midnight
  const response = await User.updateMany(
    { _id: { $in: usersToUpdate } },
    { $set: { dailyLessonCount: 0, claimedDailyRewards: [] } },
  );

  const count = response.modifiedCount;

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished resetting ${count} challenges in ${time}ms`);
};

export default resetChallenges;
