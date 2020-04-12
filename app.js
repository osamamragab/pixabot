const dotenv = require('dotenv');
const path = require('path');
const { promises: fs, existsSync } = require('fs');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

if (!process.env.unsplashAccessKey || !process.env.unsplashSecretKey) {
  console.error('[error]: unsplash api keys not found.');
  process.exit(1);
}

if (!process.env.pexelsAPIKey) {
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
  console.error('[error]: telegram bot token/chat not found.');
  process.exit(1);
}

if (!process.env.instagramUsername || !process.env.instagramPassword) {
  console.error('[error]: instagram auth stuff not found.');
  process.exit(1);
}

// where the pics will be downloaded to
const tmpPath = path.join(__dirname, 'tmp');

// check for tmp directory
(async () => {
  if (!existsSync(tmpPath)) {
    await fs.mkdir(tmpPath);
  }
})();

const getPic = require('./utils/getPic');
const download = require('./utils/download');
const push = require('./utils/push');

async function main() {
  try {
    // get the random pic
    const pic = await getPic();

    // download it
    const picPath = await download(pic.urls.medium);

    console.log(`(${pic.id}) downloaded to ${picPath} successfully`);

    // set caption
    const caption = `by: ${pic.author.name.trim()} on ${pic.platfrom}`;

    // publish the pic to all platforms
    await push(picPath, caption);

    // remove file
    await fs.unlink(picPath);

    console.log(`(${picPath}) was removed`);
  } catch (err) {
    console.error(err.message);
  }
}

main();
setInterval(main, 60 * 60 * 24 * 1000);
