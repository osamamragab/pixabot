const twitter = require('../services/twitter');
const telegram = require('../services/telegram');
const instagram = require('../services/instagram');
const { promises: fs } = require('fs');

module.exports = async (picPath, caption) => {
  // push to all
  await twitter(picPath, caption);
  await telegram(picPath, caption);
  await instagram(picPath, caption);

  console.log('pushed to all');

  // remove file
  await fs.unlink(picPath);

  console.log(`(${picPath}) was removed`);
};
