import { DateTime } from 'luxon';

import User from '@/models/user';
import logger from '@/lib/logger';

/**
 * Reset the lessons that the user has completed today, along with
 * the daily reward
 */
const clearWeekData = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Resetting week data for all users');

  const utcTime = DateTime.utc();
  const users = await User.find({});

  // Get only the users whose current time is midnight
  const usersToUpdate = users
    .filter((user) => {
      const userTime = utcTime.setZone(user.timezone);
      return userTime.hour === 0;
    })
    .map((user) => user._id);

  // Update the week data for only the users whose current time is midnight
  const response = await User.updateMany(
    { _id: { $in: usersToUpdate } },
    { $set: { weekData: [false, false, false, false, false, false, false] } },
  );

  const count = response.modifiedCount;

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished resetting ${count} week datas in ${time}ms`);
};

export default clearWeekData;
