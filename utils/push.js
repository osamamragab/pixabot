const twitter = require('../services/twitter');
const telegram = require('../services/telegram');
const instagram = require('../services/instagram');

module.exports = async (picPath, caption) => {
  await twitter(picPath, caption);
  await telegram(picPath, caption);
  await instagram(picPath, caption);

  console.log('pushed to all');
};
