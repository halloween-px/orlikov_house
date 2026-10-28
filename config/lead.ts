export const leadConfig = {
  minFillMs: 2500,
  maxFillMs: 1000 * 60 * 60,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
} as const;
