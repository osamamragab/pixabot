const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    secretKey: process.env.UNSPLASH_SECRET_KEY
  },
  twitter: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    strictSSL: true
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    channel: process.env.TELEGRAM_CHANNEL
  }
};
