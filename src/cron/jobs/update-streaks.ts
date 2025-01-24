import { DateTime } from 'luxon';

import User from '@/models/user';
import logger from '@/lib/logger';

/**
 * For every user that has not completed a lesson today, set their
 * streak back to 0
 */
const updateStreaks = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Resetting streaks for all users');

  const utcTime = DateTime.utc();
  const users = await User.find({ dailyLessonCount: 0 });

  // Get only the users whose current time is midnight
  const usersToUpdate = users
    .filter((user) => {
      const userTime = utcTime.setZone(user.timezone);
      return userTime.hour === 0;
    })
    .map((user) => user._id);

  // Update the streaks for all users who have not completed a lesson today
  const response = await User.updateMany(
    { _id: { $in: usersToUpdate } },
    { $set: { streak: 0 } },
  );

  const count = response.modifiedCount;

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished resetting ${count} streaks in ${time}ms`);
};

export default updateStreaks;
