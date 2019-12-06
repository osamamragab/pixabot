'use strict';

const fs = require('fs');

const dotenv = require('dotenv');

const logger = require('./lib/logger');

const unsplash = require('./clients/unsplash');
const twitter = require('./clients/twitter');
const telegram = require('./clients/telegram');

dotenv.config();

if (!process.env.unsplashAccessKey || !process.env.unsplashSecretKey) {
  logger('error', 'unsplash keys error');
  process.exit(1);
}

if (
  !process.env.twitterConsumerKey ||
  !process.env.twitterConsumerSecret ||
  !process.env.twitterAccessToken ||
  !process.env.twitterAccessTokenSecret
) {
  logger('error', 'twitter keys error');
  process.exit(1);
}

if (!process.env.telegramToken || !process.env.telegramChat) {
  logger('error', 'telegram bot token/chat not found');
  process.exit(1);
}

async function main() {
  try {
    let { pic, picPath } = await unsplash();
    let caption = `by: ${pic.user.name.trim()}`;

    if (!pic || !picPath) return logger('error', 'unsplash api error');
    if (!fs.existsSync(picPath)) return logger('error', `pic doesn't exists`);

    twitter(pic, picPath, caption);
    telegram(pic, picPath, caption);

    // remove the pic after one minute
    setTimeout(() => {
      if (fs.existsSync(picPath)) {
        fs.unlinkSync(picPath);
        logger('msg', `${picPath} removed`);
      }
    }, 60 * 1000);
  } catch (err) {
    logger('error', err);
  }
}

main();
setInterval(main, 60 * 60 * 1000);
