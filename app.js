const Unsplash = require('unsplash-js');
const Twit = require('twit');
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');
const { promises: fs, existsSync } = require('fs');

dotenv.config();

// for unsplash
global.fetch = fetch;

// where the pics will be downloaded to
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
(async () => {
  if (!existsSync(dataPath)) {
    await fs.mkdir(dataPath);
  }
})();

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
});

const tgBot = new TelegramBot(process.env.telegramToken);

async function main() {
  try {
    // get random pic from unsplash api
    const pic = await unsplash.photos
      .getRandomPhoto({ featured: true, orientation: 'landscape' })
      .then(Unsplash.toJson);

    // get pic buffer
    const picBuffer = await fetch(pic.urls.regular).then(res => res.buffer());

    const picName = `${pic.id}.jpg`;
    const picPath = path.join(dataPath, picName);

    // download pic
    await fs.writeFile(picPath, picBuffer, 'binary');

    console.log(`(${picName}) downloaded successfully`);

    // set caption
    const caption = `by: ${pic.user.name.trim()}`;

    // send to twitter
    twBot.postMediaChunked({ file_path: picPath }, (err, data) => {
      if (err) throw err;

      twBot.post(
        'statuses/update',
        {
          status: caption,
          media_ids: [data.media_id_string]
        },
        async (err, statusData) => {
          try {
            if (err) throw err;

            // twitter success message
            console.log(
              `(twitter#${pic.id}): https://twitter.com/${statusData.user.screen_name}/status/${statusData.id_str}`
            );

            // send to telegram
            const tgMsg = await tgBot.sendPhoto(process.env.telegramChat, picPath, { caption });

            // telegram success message
            console.log(
              `(telegram#${pic.id}): https://t.me/${tgMsg.chat.username}/${tgMsg.message_id}`
            );

            // remove pic from data/
            await fs.unlink(picPath);

            console.log(`(${picName}) was removed`);
          } catch (err) {
            console.error(err);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
}

main();
setInterval(main, 60 * 60 * 1000);
