const fs = require('fs');
const path = require('path');

const logger = require('./lib/logger');

const unsplash  = require('./clients/unsplash');
const twitter   = require('./clients/twitter');
const telegram  = require('./clients/telegram');

if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));

async function main() {
  let { pic, picPath } = await unsplash.download();
  let caption = `by: ${pic.user.name.trim()}`;

  if (!pic || !picPath) return logger('error', 'unsplash api error');
  if (!fs.existsSync(picPath)) return logger('error', `pic doesn't exists`);

  twitter(pic, picPath, caption);
  telegram(pic, picPath, caption);
}

main();
setInterval(main, 60 * 60 * 1000);
