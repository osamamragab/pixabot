import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const {
  UNSPLASH_ACCESS_KEY,
  PEXELS_API_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TELEGRAM_TOKEN,
  TELEGRAM_CHAT,
  INSTAGRAM_USERNAME,
  INSTAGRAM_PASSWORD
} = process.env;

if (!UNSPLASH_ACCESS_KEY) {
  console.error('[error]: unsplash access key not found.');
  process.exit(1);
}

if (!PEXELS_API_KEY) {
  console.error('[error]: pexels api key not found.');
  process.exit(1);
}

if (
  !TWITTER_CONSUMER_KEY ||
  !TWITTER_CONSUMER_SECRET ||
  !TWITTER_ACCESS_TOKEN ||
  !TWITTER_ACCESS_TOKEN_SECRET
) {
  console.error('[error]: twitter api keys not found.');
  process.exit(1);
}

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) {
  console.error('[error]: telegram bot token/chat not found.');
  process.exit(1);
}

if (!INSTAGRAM_USERNAME || !INSTAGRAM_PASSWORD) {
  console.error('[error]: instagram auth stuff not found.');
  process.exit(1);
}
