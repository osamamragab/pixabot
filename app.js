const twitter = require('./services/twitter');
const telegram = require('./services/telegram');
const unsplash = require('./services/unsplash');
const pexels = require('./services/pexels');
const download = require('./utils/download');
const push = require('./utils/push');
const dotenv = require('dotenv');
const path = require('path');
const { promises: fs, existsSync } = require('fs');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

// where the pics will be downloaded to
const dataPath = path.join(__dirname, 'data');

if (!process.env.unsplashAccessKey || !process.env.unsplashSecretKey) {
  console.error('[error]: unsplash api keys not found.');
  process.exit(1);
}

if (!process.env.pexelsAPIKEY) {
  console.error('[error]: pexels api key not found.');
  process.exit(1);
}

if (
  !process.env.twitterConsumerKey ||
  !process.env.twitterConsumerSecret ||
  !process.env.twitterAccessToken ||
  !process.env.twitterAccessTokenSecret
) {
  console.error('[error]: twitter api keys not found.');
  process.exit(1);
}

if (!process.env.telegramToken || !process.env.telegramChat) {
  console.error('telegram bot token/chat not found.');
  process.exit(1);
}

// check for data directory
(async () => {
  if (!existsSync(dataPath)) {
    await fs.mkdir(dataPath);
  }
})();

async function main() {
  try {
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
            const tgMsg = await tgBot.sendPhoto(
              process.env.telegramChat,
              picPath,
              { caption }
            );

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
