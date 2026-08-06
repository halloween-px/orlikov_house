export const leadConfig = {
  toEmail: process.env.LEAD_TO_EMAIL || "yaitskayayu@yandex.ru",
  fromName: "Орликов Хаус",
  minFillMs: 2500,
  maxFillMs: 1000 * 60 * 60,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
} as const;
