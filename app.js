const fs = require('fs');

const logger = require('./lib/logger');

const unsplash  = require('./clients/unsplash');
const twitter   = require('./clients/twitter');
const telegram  = require('./clients/telegram');

async function main() {
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
}

main();
setInterval(main, 60 * 60 * 1000);
