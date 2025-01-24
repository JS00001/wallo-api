import cron from 'node-cron';

import resetChallenges from './jobs/reset-challenges';
import updateStreaks from './jobs/update-streaks';
import dailyReminder from './jobs/daily-reminder';
import regenerateLives from './jobs/regenerate-lives';

const startJobs = () => {
  // Every 2 hours - Regenerate lives to full
  cron.schedule('0 */2 * * *', regenerateLives);

  // Every day at 6:00pm - Send daily reminder to do streaks
  cron.schedule('0 18 * * *', dailyReminder);

  // Every day at 12:00am - Reset daily rewards and update expired streaks
  cron.schedule('0 * * * *', async () => {
    // Update streaks first because we rely on data from daily challenges that
    // get cleared in resetChallenges
    await updateStreaks();
    await resetChallenges();
  });
};

export default { startJobs };
