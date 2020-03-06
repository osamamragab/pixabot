const Unsplash = require('unsplash-js');
const Twit = require('twit');
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const { promises: fs, existsSync } = require('fs');
const dotenv = require('dotenv');
const logger = require('./lib/logger');

dotenv.config();

// for unsplash
global.fetch = fetch;

const dataPath = path.join(__dirname, 'data');

if (!process.env.unsplashAccessKey || !process.env.unsplashSecretKey) {
  console.error('[error]: unsplash keys error');
  process.exit(1);
}

if (
  !process.env.twitterConsumerKey ||
  !process.env.twitterConsumerSecret ||
  !process.env.twitterAccessToken ||
  !process.env.twitterAccessTokenSecret
) {
  console.error('[error]: twitter keys');
  process.exit(1);
}

if (!process.env.telegramToken || !process.env.telegramChat) {
  console.error('telegram bot token/chat not found');
  process.exit(1);
}

// check for data directory
(async () => !existsSync(dataPath) && await fs.mkdir(dataPath))();

const unsplash = new Unsplash.default({
  accessKey: process.env.unsplashAccessKey,
  secretKey: process.env.unsplashSecretKey
});

const twBot = new Twit({
  consumer_key: process.env.twitterConsumerKey,
  consumer_secret: process.env.twitterConsumerSecret,
  access_token: process.env.twitterAccessToken,
  access_token_secret: process.env.twitterAccessTokenSecret,
  timeout_ms: 60 * 1000,
  strictSSL: true
})

const tgBot = new TelegramBot(process.env.telegramToken);

async function main() {
  try {
    // get random pic from unsplash api
    const pic = await unsplash.photos.getRandomPhoto({ featured: true, orientation: 'landscape' }).then(Unsplash.toJson);

    // get pic buffer
    const picBuffer = await fetch(pic.urls.regular).then(res => res.buffer());

    // set pic path
    const picPath = path.join(dataPath, `${pic.id}.jpg`);

    // download pic
    await fs.writeFile(picPath, picBuffer, 'binary');

    logger('msg', `(${pic.id}) downloaded successfully`);

    // set caption
    const caption = `by: ${pic.user.name.trim()}`;

    twBot.postMediaChunked({ file_path: picPath }, (err, data) => {
      if (err) return logger('error', err);

      twBot.post(
        'statuses/update',
        {
          status: caption,
          media_ids: [data.media_id_string]
        },
        (err, data) => {
          if (err) return logger('error', err);

          console.log(`(twitter#${pic.id}): https://twitter.com/${data.user.screen_name}/status/${data.id_str}`);
        }
      );
    });

    const tgMsg = await bot.sendPhoto(process.env.telegramChat, picPath, { caption })
    console.log(`(telegram#${pic.id}): https://t.me/${tgMsg.chat.username}/${tgMsg.message_id}`);


    // remove the pic after one minute
    setTimeout(() => {
      if (existsSync(picPath)) {
        await fs.unlink(picPath);
        console.log(`${picPath} was removed`);
      }
    }, 60 * 1000);
  } catch (err) {
    logger('error', err);
  }
}

main();
setInterval(main, 60 * 60 * 1000);
