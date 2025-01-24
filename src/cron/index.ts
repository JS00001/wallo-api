import cron from 'node-cron';

import resetChallenges from './jobs/reset-challenges';
import updateStreaks from './jobs/update-streaks';
import dailyReminder from './jobs/daily-reminder';
import regenerateLives from './jobs/regenerate-lives';
import clearWeekData from './jobs/clear-week-data';

const startJobs = () => {
  // Every 2 hours
  // Regenerate lives to full
  cron.schedule('0 */2 * * *', regenerateLives);

  // Every day at 6:00pm
  // Send daily reminder to do streaks
  cron.schedule('0 18 * * *', dailyReminder);

  // Every hour of Sundays (in the job, limits to midnight for each timezone)
  // Reset week's streak data for each timezone
  cron.schedule('0 * * * 0', clearWeekData);

  // Every hour (in the job, limits to midnight for each timezone)
  // Reset daily rewards and update expired streaks
  cron.schedule('0 * * * *', async () => {
    // Update streaks first because we rely on data from daily challenges that
    // get cleared in resetChallenges
    await updateStreaks();
    await resetChallenges();
  });
};

export default { startJobs };
