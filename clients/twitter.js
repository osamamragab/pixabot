const config = require('../config');
const logger = require('../lib/logger');

const Twit = require('twit');
const bot = new Twit(config.twitter);

module.exports = (pic, picPath, caption) => {
  bot.postMediaChunked({ file_path: picPath }, (err, data, res) => {
    if (err) return logger('error', err);

    let twUsername = pic.user.twitter_username && pic.user.twitter_username.trim();

    if (twUsername && !caption.includes(`@${twUsername}`)) caption += ` (${(twUsername.startsWith('@') ? '' : '@') + twUsername})`;

    bot.post('statuses/update', {
      status: caption,
      media_ids: [data.media_id_string]
    }, (err, data, res) => {
      if (err) return logger('error', err);

      logger('success', `(twitter@${pic.id}): success!`);
    });
  });
};
