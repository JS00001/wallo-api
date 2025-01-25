const metadata = {
  /** How many lives the user gets every x amount of time/on refresh */
  defaultLives: 5,
  /** Rewards data (% chance of getting a range of each) */
  rewards: {
    // 90% chance of getting 1-100 coins
    [90]: { min: 50, max: 100 },
    // 9% chance of getting 100-500 coins
    [99]: { min: 100, max: 500 },
    // 1% chance of getting 500-1000 coins
    [100]: { min: 500, max: 1000 },
  },
};

export default metadata;
