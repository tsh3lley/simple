import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const {
  JWT_SECRET,
  PLAID_CLIENT_ID,
	PLAID_SECRET,
	PLAID_PUBLIC_KEY,
	PLAID_ENV,
	WEBHOOK_URL,

} = process.env;

const defaults = {
  JWT_SECRET: 'your_secret',
};

Object.keys(defaults).forEach((key) => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`);
  }
});
