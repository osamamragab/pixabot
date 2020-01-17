'use strict';

const Twit = require('twit');

const config = require('../config');
const logger = require('../lib/logger');

const bot = new Twit(config.twitter);

module.exports = (pic, picPath, caption) => {
  bot.postMediaChunked({ file_path: picPath }, (err, data) => {
    if (err) return logger('error', err);

    if (pic.user.twitter_username) {
      const twUsername = pic.user.twitter_username.trim();
      if (twUsername.startsWith('@')) twUsername = twUsername.slice(1);

      if (!caption.includes(`@${twUsername}`)) {
        logger(`getting twitter user: ${twUsername}`);

        bot.get(
          'users/show',
          {
            screen_name: twUsername
          },
          err => {
            if (err) return;

            caption += ` (@${twUsername})`;
          }
        );
      }
    }

    bot.post(
      'statuses/update',
      {
        status: caption,
        media_ids: [data.media_id_string]
      },
      (err, data) => {
        if (err) return logger('error', err);

        logger(
          'success',
          `(twitter#${pic.id}): https://twitter.com/${data.user.screen_name}/status/${data.id_str}`
        );
      }
    );
  });
};
