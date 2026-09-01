const DEFAULT_TO_EMAIL = "yaitskayayu@yandex.ru";

function parseToEmails() {
  const fromEnv = process.env.LEAD_TO_EMAIL?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (fromEnv?.length) return fromEnv;

  return [DEFAULT_TO_EMAIL];
}

export const leadConfig = {
  toEmails: parseToEmails(),
  fromName: "Орликов дом",
  minFillMs: 2500,
  maxFillMs: 1000 * 60 * 60,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
} as const;
