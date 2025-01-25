import metadata from '@/constants/metadata';

/**
 * Get a random reward
 */
export const getRandomReward = () => {
  const random = Math.random() * 100;

  for (const [chance, reward] of Object.entries(metadata.rewards)) {
    if (random <= Number(chance)) {
      const value = Math.random() * (reward.max - reward.min) + reward.min;
      return Math.floor(value);
    }
  }

  return 0;
};
